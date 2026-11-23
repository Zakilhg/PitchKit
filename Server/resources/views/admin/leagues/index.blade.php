@php
    $items = $leagues;
    $resource = 'league';
    $singular = 'league';
    $plural = 'leagues';
    $columns = [
        'Clubs#' => fn ($league) => $clubCounts[$league->id] ?? 0,
        'Jerseys#' => fn ($league) => $jerseyCounts[$league->id] ?? 0,
    ];
@endphp
@extends('admin.partials.simple-index')
