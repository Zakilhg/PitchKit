@extends('layouts.dashboard')
@section('home')

    <div class="container " id="list-items">
        <div class="table-wrapper">
            <div class="table-title">
                <div class="row">
                    <div class="col-sm-6">
                        <h2>Leagues List</h2>
                    </div>
                    <div class="col-sm-6" id="list-items-button-container">
                        <a href="{{ route('league.create')}}" class="btn"  data-toggle="modal"><i class="fa-solid fa-plus"></i> <span>Add New </span></a>

                    </div>
                </div>
            </div>
            <table class="table text-dark">
                <thead>
                <tr>
                    <th>#</th>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                @foreach($leagues as $league)
                    <tr>
                        <td>{{$league->id}}</td>
                        <td><img src="{{asset('images/'.$league->image)}}" alt="{{$league->name}}" width="50" height="50" class="img"/></td>
                        <td>{{$league->name}}</td>
                        <td class="icons-column d-flex justify-content-center align-items-center">
                            <div class="icons-container">
                            <a href="{{ route('league.edit', $league->id)}}" class="edit" data-toggle="modal"><i  class="fa-solid fa-pen-to-square" title="Edit"></i></a>
                            <form action="{{ route('league.destroy', $league->id) }}" method="post" >
                                @csrf @method('DELETE')
                                <i class="fa-solid fa-trash" title="Delete" onclick="confirmDelete(event)"></i>
                            </form>
                            </div>
                        </td>
                    </tr>

                @endforeach
                </tbody>
            </table>

        </div>
    </div>

@endsection


