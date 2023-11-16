@extends('layouts.app')
@section('content')
    <div class="containerr">
        <!-- Sidebar Section -->
        <aside>
            <div class="toggle">
                <div class="logo">

                    <h2>PitchKit.<span class="danger"></span></h2>
                </div>
                <div class="close" id="close-btn">
                    <span class="material-icons-sharp">
                        close
                    </span>
                </div>
            </div>

            <div class="sidebar">
                <a href="/">
                    <span>
                        <i class='bx bxs-dashboard'></i>
                    </span>
                    <h3>Dashboard</h3>
                </a>
                <a class="{{ Request::is('/') ? ' active' : '' }}" href="/">
                    <span>
                        <i class='bx bxs-objects-vertical-center'></i>
                    </span>
                    <h3>Analytics</h3>
                </a>
                <a class="{{ Request::is('jersey*') ? ' active' : '' }}" href="{{ route('jersey.index') }}">
                    <span>
                        <i class='bx bxs-t-shirt'></i>
                    </span>
                    <h3>Jersey</h3>
                </a>
                <a class="{{ Request::is('brand*') ? ' active' : '' }}" href="{{ route('brand.index') }}">
                    <span class="material-icons-sharp">
                        mail_outline
                    </span>
                    <h3>Brands</h3>
                </a>
                <a class="{{ Request::is('league*') ? ' active' : '' }}" href="{{ route('league.index') }}">
                    <span>
                        <i class='bx bx-football' ></i>
                    </span>
                    <h3>Leagues</h3>
                </a>
                <a class="{{ Request::is('club*') ? ' active' : '' }}" href="{{ route('club.index') }}">
                    <span class="material-icons-sharp">
                        report_gmailerrorred
                    </span>
                    <h3>Clubs</h3>
                </a>
                <a href="#">
                    <span class="material-icons-sharp">
                        person_outline
                    </span>
                    <h3>Users</h3>
                </a>
                <a href="#">
                    <span class="material-icons-sharp">
                        settings
                    </span>
                    <h3>Settings</h3>
                </a>
                <a href="#">
                    <span class="material-icons-sharp">
                        add
                    </span>
                    <h3>New Login</h3>
                </a>
                <a href="{{route('auth.logout')}}">
                    <span class="material-icons-sharp">
                        logout
                    </span>
                    <h3>Logout</h3>
                </a>
            </div>
        </aside>
        <!-- End of Sidebar Section -->
        @yield('home')

        <!-- Right Section -->
        <div class="right-section">
            <div class="nav">
                <button id="menu-btn">
                    <span class="material-icons-sharp">
                        menu
                    </span>
                </button>





                <div class="dark-mode">
                    <span class="material-icons-sharp active">
                        light_mode
                    </span>
                    <span class="material-icons-sharp">
                        dark_mode
                    </span>
                </div>






                <div class="profile">
                    <div class="info">
                        <p>Hey, <b>Anas</b></p>
                        <small class="text-muted">Admin</small>
                    </div>
                    <div class="profile-photo">
                        <img src="{{asset('profile/default.jpg')}}" alt="profile">
                    </div>
                </div>

            </div>
            <!-- End of Nav -->

            <div class="user-profile">
                <div class="logo">
                    <img src="{{asset('images/messi1.jpg')}}" alt="1">
                    <h2>PitchKit.</h2>
                </div>
            </div>

            <div class="reminders">
                <div class="header">
                    <h2>Reminders</h2>
                    <span class="material-icons-sharp">
                        notifications_none
                    </span>
                </div>

                <div class="notification">
                    <div class="icon">
                        <span class="material-icons-sharp">
                            volume_up
                        </span>
                    </div>
                    <div class="content">
                        <div class="info">
                            <h3>Workshop</h3>
                            <small class="text_muted">
                                08:00 AM - 12:00 PM
                            </small>
                        </div>
                        <span class="material-icons-sharp">
                            more_vert
                        </span>
                    </div>
                </div>

                <div class="notification deactive">
                    <div class="icon">
                        <span class="material-icons-sharp">
                            edit
                        </span>
                    </div>
                    <div class="content">
                        <div class="info">
                            <h3>Workshop</h3>
                            <small class="text_muted">
                                08:00 AM - 12:00 PM
                            </small>
                        </div>
                        <span class="material-icons-sharp">
                            more_vert
                        </span>
                    </div>
                </div>

                <div class="notification add-reminder">
                    <div>
                        <span class="material-icons-sharp">
                            add
                        </span>
                        <h3>Add Reminder</h3>
                    </div>
                </div>

            </div>

        </div>





    </div>
@endsection
