@extends('layouts.dashboard')

@section('home')
    <div class="container" style="background-color:lightgrey ; color: black; margin-top: 34px ;padding: 21px;border-radius: 21px;">
        <h1 class="mb-4">Edit League</h1>
        <form action="{{ route('league.update', $league->id) }}" method="POST" enctype="multipart/form-data">
            @csrf
            @method('PUT')
            <div class="form-group">
                <label for="league_name">League Name:</label>
                <input type="text" name="league_name" id="league_name" class="form-control" value="{{ $league->name }}" required>
            </div>

            <div class="form-group">
                <label for="league_image">League Image:</label>
                <div class="custom-file">
                    <input type="file" name="league_image" id="league_image" class="custom-file-input">
                    <label class="custom-file-label" for="league_image">Choose file</label>
                </div>
            </div>

            <br>
            <button type="submit" class="btn btn-primary">Update League</button>
        </form>
    </div>
@endsection
