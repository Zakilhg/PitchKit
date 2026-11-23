<?php

namespace App\Http\Controllers;

use App\Models\Brand;
use App\Models\Club;
use App\Models\Jersey;
use App\Models\League;
use Illuminate\View\View;

class DashboardController extends Controller
{
    private const LOW_STOCK = 10;

    public function __invoke(): View
    {
        return view('admin.dashboard', [
            'stats' => [
                'jerseys' => Jersey::count(),
                'units' => (int) Jersey::sum('quantity'),
                'clubs' => Club::count(),
                'brands' => Brand::count(),
                'leagues' => League::count(),
                'outOfStock' => Jersey::where('quantity', '<=', 0)->count(),
            ],
            'lowStock' => Jersey::with('club')
                ->where('quantity', '<=', self::LOW_STOCK)
                ->orderBy('quantity')
                ->limit(6)
                ->get(),
            'recent' => Jersey::with(['brand', 'club'])->latest()->limit(5)->get(),
            'lowStockLimit' => self::LOW_STOCK,
        ]);
    }
}
