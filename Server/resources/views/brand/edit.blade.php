@extends('layouts.dashboard')

@section('home')
    <div class="container" style="background-color:lightgrey ; color: black; margin-top: 34px ;padding: 21px;border-radius: 21px;">
        <h1 class="mb-4">Edit Brand</h1>
        <form action="{{ route('brand.update', $brand->id) }}" method="POST" enctype="multipart/form-data">
    @csrf
    @method('PUT')
            <div class="form-group">
                <label for="brand_name">Brand Name:</label>
                <input type="text" name="brand_name" id="brand_name" class="form-control" value="{{ $brand->name }}" required>
            </div>

            <div class="form-group">
                <label for="brand_image">Brand Image:</label>
                <div class="custom-file">
                    <input type="file" name="brand_image" id="brand_image" class="custom-file-input">
                    <label class="custom-file-label" for="brand_image">Choose file</label>
                </div>
            </div>

            <br>
            <button type="submit" class="btn btn-primary">Update Brand</button>
        </form>
    </div>
@endsection

