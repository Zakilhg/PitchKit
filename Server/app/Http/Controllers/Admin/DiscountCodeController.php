<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\DiscountCode;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Validation\Rule;
use Illuminate\View\View;

class DiscountCodeController extends Controller
{
    public function index(): View
    {
        $codes = DiscountCode::query()->withCount('orders')->orderByDesc('created_at')->get();

        return view('admin.discount-codes.index', compact('codes'));
    }

    public function create(): View
    {
        return view('admin.discount-codes.form', ['code' => new DiscountCode(['type' => DiscountCode::PERCENT, 'is_active' => true])]);
    }

    public function store(Request $request): RedirectResponse
    {
        $code = DiscountCode::create($this->validated($request, null));

        return redirect()->route('discount-code.index')->with('success', "{$code->code} was added.");
    }

    public function edit(DiscountCode $discountCode): View
    {
        return view('admin.discount-codes.form', ['code' => $discountCode]);
    }

    public function update(Request $request, DiscountCode $discountCode): RedirectResponse
    {
        $discountCode->update($this->validated($request, $discountCode));

        return redirect()->route('discount-code.index')->with('success', "{$discountCode->code} was updated.");
    }

    public function destroy(DiscountCode $discountCode): RedirectResponse
    {
        // Orders keep their own copy of the code and amount, so they're unaffected.
        $discountCode->delete();

        return redirect()->route('discount-code.index')->with('success', "{$discountCode->code} was deleted.");
    }

    /** Amounts are typed in dollars and stored in cents; codes are stored upper-case. */
    private function validated(Request $request, ?DiscountCode $existing): array
    {
        $request->merge(['code' => DiscountCode::normalise($request->input('code'))]);
        $type = $request->input('type');

        $data = $request->validate([
            'code' => [
                'required', 'regex:/^[A-Z0-9_-]{3,32}$/',
                Rule::unique('discount_codes', 'code')->ignore($existing?->id),
            ],
            'type' => ['required', Rule::in(DiscountCode::TYPES)],
            'value' => match ($type) {
                DiscountCode::PERCENT => ['required', 'integer', 'between:1,100'],
                DiscountCode::FIXED => ['required', 'numeric', 'min:0.01', 'max:10000'],
                default => ['nullable'],
            },
            'min_subtotal' => ['nullable', 'numeric', 'min:0', 'max:100000'],
            'max_uses' => ['nullable', 'integer', 'min:1'],
            'expires_at' => ['nullable', 'date'],
            'is_active' => ['boolean'],
        ], [
            'code.regex' => 'Use 3 to 32 letters, numbers, dashes or underscores, with no spaces.',
        ], [
            'value' => $type === DiscountCode::PERCENT ? 'percentage' : 'amount',
            'min_subtotal' => 'minimum order',
        ]);

        return [
            'code' => $data['code'],
            'type' => $data['type'],
            'value' => match ($data['type']) {
                DiscountCode::PERCENT => (int) $data['value'],
                DiscountCode::FIXED => (int) round($data['value'] * 100),
                default => 0,
            },
            'min_subtotal_cents' => (int) round(((float) ($data['min_subtotal'] ?? 0)) * 100),
            'max_uses' => filled($data['max_uses'] ?? null) ? (int) $data['max_uses'] : null,
            // A code "expiring on the 31st" still works all day on the 31st.
            'expires_at' => filled($data['expires_at'] ?? null) ? Carbon::parse($data['expires_at'])->endOfDay() : null,
            'is_active' => $request->boolean('is_active'),
        ];
    }
}
