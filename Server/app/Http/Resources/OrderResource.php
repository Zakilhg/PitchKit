<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** What a customer may see about their order. Never includes other customers' data. */
class OrderResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'token' => $this->public_token,
            'reference' => $this->reference(),
            'status' => $this->status,
            'email' => $this->email,
            'name' => $this->name,
            'shipping_address' => $this->shipping_address,
            'subtotal_cents' => $this->subtotal_cents,
            'shipping_cents' => $this->shipping_cents,
            'total_cents' => $this->total_cents,
            'currency' => $this->currency,
            'gateway' => $this->gateway,
            'expires_at' => $this->expires_at?->toIso8601String(),
            'paid_at' => $this->paid_at?->toIso8601String(),
            'fulfilled_at' => $this->fulfilled_at?->toIso8601String(),
            'created_at' => $this->created_at?->toIso8601String(),
            'items' => $this->whenLoaded('items', fn () => $this->items->map(fn ($item) => [
                'jersey_id' => $item->jersey_id,
                'name' => $item->name,
                'image' => $item->image,
                'size' => $item->size,
                'quantity' => $item->quantity,
                'unit_price_cents' => $item->unit_price_cents,
            ])),
        ];
    }
}
