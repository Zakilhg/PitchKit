@extends('layouts.dashboard')
@section('home')

    <div class="container " id="list-items">
        <div class="table-wrapper">
            <div class="table-title">
                <div class="row">
                    <div class="col-sm-6">
                        <h2>Jerseys List</h2>
                    </div>
                    <div class="col-sm-6" id="list-items-button-container">
                        <a href="{{ route('jersey.create')}}" class="btn"  data-toggle="modal"><i class="fa-solid fa-plus"></i> <span>Add New </span></a>

                    </div>
                </div>
            </div>
            <table class="table text-dark">
                <thead>
                <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Brand</th>
                    <th>Price</th>
                    <th>Club</th>
                    <th>League</th>
                    <th>Quantity</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                @foreach($jerseys as $jersey)
                    <tr>
                        <td><img src="{{asset('images/'.$jersey->image)}}" alt="{{$jersey->name}}" width="50"
                                 height="50" class="img"></td>
                        <td>{{$jersey->name}}</td>
                        <td>{{$jersey->brand->name}}</td>
                        <td>{{$jersey->price}} $</td>
                        <td>{{$jersey->club->name}}</td>
                        <td>{{$jersey->league->name}}</td>
                        <td>{{$jersey->quantity}}</td>

                        <td class="icons-column d-flex justify-content-center align-items-center">
                            <div class="icons-container">
                                <a href="{{ route('jersey.edit', $jersey->id) }}" class="edit" data-toggle="modal">
                                    <i class="fa-solid fa-pen-to-square" title="Edit"></i>
                                </a>
                                <form action="{{ route('jersey.destroy', $jersey->id) }}" method="post">
                                    @csrf
                                    @method('DELETE')
                                    <i class="fa-solid fa-trash" title="Delete" onclick="confirmDelete(event)"></i>
                                </form>
                            </div>


                        </td>
                    </tr>

                @endforeach
                </tbody>
            </table>
            <div class="row">
                <div class="col-sm-12">
                    {{ $jerseys->links() }}
                </div>
            </div>
        </div>
    </div>


@endsection


