@extends('layouts.dashboard')

@section('home')
    <div class="container" style="background-color:lightgrey ; color: black; margin-top: 34px ;padding: 21px;border-radius: 21px;">
        <h1 class="mb-4">Add New Jersey</h1>
        <form action="{{ route('jersey.update', $jersey->id) }}" method="POST" enctype="multipart/form-data">
            @csrf
            @method('PUT')

            <div class="form-group">
                <label for="jersey_name">Jersey Name:</label>
                <input type="text" name="jersey_name" id="jersey_name" class="form-control" >
            </div>

            <div class="form-group">
                <label for="jersey_image1">Jersey Image1:</label>
                <div class="custom-file">
                    <input type="file" name="jersey_image1" id="jersey_image" class="custom-file-input" required>
                    <label class="custom-file-label" for="jersey_image">Choose file</label>
                </div>
            </div>
            <div class="form-group">
                <label for="jersey_image2">Jersey Image2:</label>
                <div class="custom-file">
                    <input type="file" name="jersey_image2" id="jersey_image" class="custom-file-input" required>
                    <label class="custom-file-label" for="jersey_image">Choose file</label>
                </div>
            </div>
            <div class="form-group">
                <label for="jersey_image3">Jersey Image3:</label>
                <div class="custom-file">
                    <input type="file" name="jersey_image3" id="jersey_image" class="custom-file-input" required>
                    <label class="custom-file-label" for="jersey_image">Choose file</label>
                </div>
            </div>

            <div class="form-group">
                <label for="club_id">Club:</label>
                <select name="club_id" id="club_id" class="form-control" >
                    @foreach ($clubs as $club)
                        <option value="{{ $club->id }}">{{ $club->name }}</option>
                    @endforeach
                </select>
            </div>

            <div class="form-group">
                <label for="brand_id">Brand:</label>
                <select name="brand_id" id="brand_id" class="form-control" >
                    @foreach ($brands as $brand)
                        <option value="{{ $brand->id }}">{{ $brand->name }}</option>
                    @endforeach
                </select>
            </div>

            <div class="form-group">
                <label for="league_id">League:</label>
                <select name="league_id" id="league_id" class="form-control" >
                    @foreach ($leagues as $league)
                        <option value="{{ $league->id }}">{{ $league->name }}</option>
                    @endforeach
                </select>
            </div>

            <div class="form-group">
                <label for="price">Price:</label>
                <div class="input-group">
                    <div class="input-group-prepend">
                        <span class="input-group-text">$</span>
                    </div>
                    <input type="number" step="0.01" name="price" id="price" class="form-control" >
                </div>
            </div>

            <div class="form-group">
                <label for="quantity">Quantity:</label>
                <input type="text" name="quantity" id="quantity" class="form-control" >
            </div>
            <br>
            <button type="submit" class="btn btn-primary">Create Jersey</button>
        </form>
    </div>
@endsection
