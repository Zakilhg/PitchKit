@extends('layouts.app')
@section('content')


    <style>
        .notif {
            position: absolute;
            z-index: 1;
            right: 10px;
            bottom: 10px;
            display: none;
            transition: transform 0.3s ease-in-out;
            transform: translateX(100%);
        }

        .active {
            display: block;
            transform: translateX(0);
        }

        #X {
            cursor: pointer;
        }
    </style>

    <div id="alert" class="notif">
        @if(session()->has('success'))
            <div class="alert alert-success">
                {{ session('success') }} &nbsp;
                <i class="fa-solid fa-x" id="X"></i>
            </div>
        @elseif(session()->has('error'))
            <div class="alert alert-danger">
                {{ session('error') }}
                <i class="fa-solid fa-x" id="X"></i>
            </div>
        @endif
    </div>

{{--    <main>--}}
{{--        <div class="box">--}}
{{--            <div class="inner-box">--}}
{{--                <div class="forms-wrap">--}}
{{--                    <form action="{{route('auth.signin')}}" method="POST"  autocomplete="off" class="sign-in-form">--}}
{{--                        @csrf--}}

{{--                        <div class="logo">--}}
{{--                            <h4>Pitchkit.</h4>--}}
{{--                        </div>--}}

{{--                        <div class="heading">--}}
{{--                            <h2>Welcome Back</h2>--}}

{{--                        </div>--}}

{{--                        <div class="actual-form">--}}
{{--                            <div class="input-wrap">--}}
{{--                                <input--}}
{{--                                    type="text"--}}
{{--                                    minlength="4"--}}
{{--                                    class="input-field"--}}
{{--                                    autocomplete="off"--}}
{{--                                    name="email"--}}
{{--                                    required--}}
{{--                                />--}}
{{--                                <label>Email</label>--}}
{{--                            </div>--}}

{{--                            <div class="input-wrap">--}}
{{--                                <input--}}
{{--                                    type="password"--}}
{{--                                    minlength="4"--}}
{{--                                    class="input-field"--}}
{{--                                    autocomplete="off"--}}
{{--                                    name="password"--}}
{{--                                    required--}}
{{--                                />--}}
{{--                                <label>Password</label>--}}
{{--                            </div>--}}

{{--                            <input type="submit" value="Sign In" class="sign-btn" />--}}


{{--                        </div>--}}
{{--                    </form>--}}


{{--                </div>--}}


{{--            </div>--}}
{{--        </div>--}}
{{--    </main>--}}


    <nav class="nav-container">
        <div class="nav-logo"><h3>PitchKit.</h3></div>
        <div class="nav-link">
            <a href="#">Login</a>
        </div>
    </nav>

    <main>
        <div class="container">
            <div class="login-title"><h3>Login</h3></div>
            <form action="{{route('auth.signin')}}" method="POST">
                @csrf
                <div class="input-field-grp">
                    <label for="email_id">Email:</label>
                    <input type="text" id="email" name="email" />
                </div>
                <div class="input-field-grp">
                    <label for="password_id">Password:</label>
                    <input type="password" id="password_id" name="password" />
                </div>
                <div class="btn"><button>Login</button></div>
            </form>
        </div>
    </main>
    <script>
        const alertDiv = document.querySelector("#alert");
        const closeButton = document.querySelector("#X");

        const showAlert = () => {
            // Display the alert
            alertDiv.classList.add('active');

            // Set a timeout to hide the alert after 3 seconds
            setTimeout(() => {
                alertDiv.classList.remove('active');
                // Hide the alert when the transition is complete

            }, 3000);
        }

        // Call the showAlert function to display the alert
        showAlert();
        closeButton.addEventListener('click', () => {
            alertDiv.classList.remove('active');
            alertDiv.style.display = "none";
        });


    </script>

@endsection
