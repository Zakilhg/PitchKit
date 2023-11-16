@extends('layouts.dashboard')

@section('home')
    <div class="container" style="background-color:lightgrey ; color: black; margin-top: 34px ;padding: 21px;border-radius: 21px;">
        <h1 class="mb-4">Add New Brand</h1>
        <form action="{{ route('brand.store') }}" method="POST" enctype="multipart/form-data">
            @csrf

            <div class="form-group">
                <label for="brand_name">Brand Name:</label>
                <input type="text" name="brand_name" id="brand_name" class="form-control" required>
            </div>

            <div class="form-group">
                <label for="brand_image">Brand Image:</label>
                <div class="custom-file">
                    <input type="file" name="brand_image" id="brand_image" class="custom-file-input" required>
                    <label class="custom-file-label" for="brand_image">Choose file</label>
                </div>
            </div>


            <br>
            <button type="submit" class="btn btn-primary">Add Brand</button>
        </form>
    </div>
@endsection
