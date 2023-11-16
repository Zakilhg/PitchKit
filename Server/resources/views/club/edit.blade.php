@extends('layouts.dashboard')

@section('home')
    <div class="container" style="background-color:lightgrey ; color: black; margin-top: 34px ;padding: 21px;border-radius: 21px;">
        <h1 class="mb-4">Add New Club</h1>
        <form action="{{ route('club.update',$club->id) }}" method="POST" enctype="multipart/form-data">
            @csrf
            @method('PUT')
            <div class="form-group">
                <label for="club_name">Club Name:</label>
                <input type="text" name="club_name" id="club_name" class="form-control" value={{$club->name}} required>
            </div>

            <div class="form-group">
                <label for="club_image">Club Image:</label>
                <div class="custom-file">
                    <input type="file" name="club_image" id="club_image" class="custom-file-input" >
                    <label class="custom-file-label" for="club_image">Choose file</label>
                </div>
            </div>


            <div class="form-group">
                <label for="league_id">League:</label>
                <select name="league_id" id="league_id" class="form-control" required>
                    @foreach ($leagues as $league)
                        <option value="{{ $league->id }}">{{ $league->name }}</option>
                    @endforeach
                </select>
            </div>

            <br>
            <button type="submit" class="btn btn-primary">Add Club</button>
        </form>
    </div>
@endsection
