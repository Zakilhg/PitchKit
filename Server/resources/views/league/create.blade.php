@extends('layouts.dashboard')
@section('home')
    <div class="container" style="background-color:lightgrey ; color: black; margin-top: 34px ;padding: 21px;border-radius: 21px;">
        <h1 class="mb-4">Add New League</h1>
        <form action="{{ route('league.store') }}" method="POST" enctype="multipart/form-data">
            @csrf
            <div class="form-group">
                <label for="league_name">League Name:</label>
                <input type="text" name="league_name" id="league_name" class="form-control" required>
            </div>

            <div class="form-group">
                <label for="league_image">League Image:</label>
                <div class="custom-file">
                    <input type="file" name="league_image" id="league_image" class="custom-file-input" required>
                    <label class="custom-file-label" for="league_image">Choose file</label>
                </div>
            </div>
            <br>
            <button type="submit" class="btn btn-primary">Add League</button>
        </form>
    </div>
@endsection
