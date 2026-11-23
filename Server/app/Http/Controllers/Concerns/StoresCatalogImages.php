<?php

namespace App\Http\Controllers\Concerns;

use Illuminate\Http\Request;

trait StoresCatalogImages
{
    /**
     * Rules for an uploaded image field: required on create, optional on edit.
     */
    protected function imageRules(bool $required): array
    {
        return [$required ? 'required' : 'nullable', 'image', 'max:4096'];
    }

    /**
     * Save each uploaded file under a unique name in public/images and return
     * the new filenames keyed by field. Fields without an upload are skipped,
     * so editing a record keeps its existing images.
     */
    protected function storeImages(Request $request, array $fields): array
    {
        $stored = [];

        foreach ($fields as $field) {
            if ($request->hasFile($field)) {
                $stored[$field] = $request->file($field)->store('', 'catalog');
            }
        }

        return $stored;
    }
}
