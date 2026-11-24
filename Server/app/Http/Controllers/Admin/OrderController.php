<?php

namespace App\Http\Controllers\Admin;

use App\Checkout\Checkout;
use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class OrderController extends Controller
{
    public const FILTERS = [
        '' => 'All',
        Order::PAID => 'To ship',
        Order::FULFILLED => 'Shipped',
        Order::PENDING => 'Awaiting payment',
        'closed' => 'Cancelled & expired',
    ];

    public function index(Request $request): View
    {
        $status = array_key_exists((string) $request->query('status'), self::FILTERS)
            ? (string) $request->query('status')
            : '';
        $search = trim((string) $request->query('search'));

        $orders = Order::query()
            ->withCount('items')
            ->withSum('items', 'quantity')
            ->when($status === 'closed', fn ($q) => $q->whereIn('status', [Order::CANCELLED, Order::EXPIRED]))
            ->when($status !== '' && $status !== 'closed', fn ($q) => $q->where('status', $status))
            ->when($search !== '', function ($q) use ($search) {
                $id = (int) ltrim(preg_replace('/^PK-/i', '', $search), '0');
                $q->where(fn ($q) => $q->where('email', 'like', "%{$search}%")
                    ->orWhere('name', 'like', "%{$search}%")
                    ->when($id > 0, fn ($q) => $q->orWhere('id', $id)));
            })
            ->latest()
            ->paginate(15)
            ->withQueryString();

        $counts = Order::query()->selectRaw('status, count(*) as total')->groupBy('status')->pluck('total', 'status');

        return view('admin.orders.index', [
            'orders' => $orders,
            'status' => $status,
            'search' => $search,
            'filters' => self::FILTERS,
            'counts' => $counts,
        ]);
    }

    public function show(Order $order): View
    {
        return view('admin.orders.show', ['order' => $order->load(['items.jersey', 'user'])]);
    }

    public function fulfil(Order $order, Checkout $checkout): RedirectResponse
    {
        if ($order->status !== Order::PAID) {
            return back()->with('error', 'Only paid orders can be marked as shipped.');
        }
        $checkout->fulfil($order);

        return back()->with('success', "{$order->reference()} is marked as shipped.");
    }

    public function cancel(Order $order, Checkout $checkout): RedirectResponse
    {
        if (! $order->isPending()) {
            return back()->with('error', 'Only orders awaiting payment can be cancelled here.');
        }
        $checkout->cancel($order);

        return back()->with('success', "{$order->reference()} was cancelled and its stock released.");
    }
}
