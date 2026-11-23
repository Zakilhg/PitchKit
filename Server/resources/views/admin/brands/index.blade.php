@php
    $items = $brands;
    $resource = 'brand';
    $singular = 'brand';
    $plural = 'brands';
    $columns = ['Jerseys#' => fn ($brand) => $counts[$brand->id] ?? 0];
@endphp
@extends('admin.partials.simple-index')
