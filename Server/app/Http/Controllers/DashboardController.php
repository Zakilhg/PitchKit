<?php

namespace App\Http\Controllers;

use App\Models\Jersey;
use App\Models\Order;
use Illuminate\Support\Carbon;
use Illuminate\View\View;

class DashboardController extends Controller
{
    private const LOW_STOCK = 10;

    private const CHART_DAYS = 14;

    public function __invoke(): View
    {
        $since = now()->subDays(29)->startOfDay();
        $sold = Order::query()->sold()->where('paid_at', '>=', $since);
        $revenue = (int) (clone $sold)->sum('total_cents');
        $orders = (clone $sold)->count();

        return view('admin.dashboard', [
            'stats' => [
                'revenue' => $revenue,
                'orders' => $orders,
                'average' => $orders ? intdiv($revenue, $orders) : 0,
                'toShip' => Order::where('status', Order::PAID)->count(),
                'units' => (int) Jersey::sum('quantity'),
                'outOfStock' => Jersey::where('quantity', '<=', 0)->count(),
            ],
            'chart' => $this->dailyRevenue(),
            'recentOrders' => Order::query()->withSum('items', 'quantity')->latest()->limit(6)->get(),
            'lowStock' => Jersey::with('club')
                ->where('quantity', '<=', self::LOW_STOCK)
                ->orderBy('quantity')
                ->limit(6)
                ->get(),
            'lowStockLimit' => self::LOW_STOCK,
        ]);
    }

    /** @return array<int, array{date: Carbon, cents: int}> one entry per day, oldest first */
    private function dailyRevenue(): array
    {
        $start = now()->subDays(self::CHART_DAYS - 1)->startOfDay();
        $byDay = Order::query()->sold()->where('paid_at', '>=', $start)->get(['paid_at', 'total_cents'])
            ->groupBy(fn (Order $order) => $order->paid_at->toDateString())
            ->map->sum('total_cents');

        return collect(range(0, self::CHART_DAYS - 1))->map(function (int $offset) use ($start, $byDay) {
            $date = $start->copy()->addDays($offset);

            return ['date' => $date, 'cents' => (int) ($byDay[$date->toDateString()] ?? 0)];
        })->all();
    }
}
