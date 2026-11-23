@php
    $items = $clubs;
    $resource = 'club';
    $singular = 'club';
    $plural = 'clubs';
    $columns = [
        'League' => fn ($club) => $club->league?->name ?? '—',
        'Jerseys#' => fn ($club) => $counts[$club->id] ?? 0,
    ];
@endphp
@extends('admin.partials.simple-index')
