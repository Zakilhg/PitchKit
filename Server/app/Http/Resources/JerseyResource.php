<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class JerseyResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'price' => $this->price,
            'quantity' => $this->quantity,
            'images' => array_values(array_filter([
                $this->image,
                $this->image1,
                $this->image2,
            ])),
            'image' => $this->image,
            'image1' => $this->image1,
            'image2' => $this->image2,
            'brand' => $this->whenLoaded('brand', fn () => $this->brand ? [
                'id' => $this->brand->id,
                'name' => $this->brand->name,
                'image' => $this->brand->image,
            ] : null),
            'club' => $this->whenLoaded('club', fn () => $this->club ? [
                'id' => $this->club->id,
                'name' => $this->club->name,
            ] : null),
            'league' => $this->whenLoaded('league', fn () => $this->league ? [
                'id' => $this->league->id,
                'name' => $this->league->name,
            ] : null),
            // Compatibility fields are temporary while the legacy client is upgraded.
            'brand_image' => $this->whenLoaded('brand', fn () => $this->brand?->image),
            'brand_name' => $this->whenLoaded('brand', fn () => $this->brand?->name),
            'club_name' => $this->whenLoaded('club', fn () => $this->club?->name),
            'league_name' => $this->whenLoaded('league', fn () => $this->league?->name),
        ];
    }
}
