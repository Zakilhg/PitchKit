@extends('layouts.app')
@section('content')
    <div class="container">
        <div class="row">
            <div class="col-md-12">
                <h1>Register</h1>
                <form action="{{route('auth.signup')}}" method="POST">
                    @csrf
                    <div class="form-group">
                        <label for="name">Username :</label>
                        <input type="text" class="form-control" name="name">
                    </div>
                    <div class="form-group">
                        <label for="email">Email :</label>
                        <input type="email" class="form-control" name="email">
                    </div>
                    <div class="form-group">
                        <label for="password">Password :</label>
                        <input type="text" class="form-control" name="password">
                    </div>


                    <button type="submit" class="btn btn-success">Sign Up</button>
                </form>
            </div>
        </div>
    </div>
@endsection
