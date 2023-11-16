@extends('layouts.dashboard')

@section('home')




{{--    <div class="container" style="background-color:lightgrey ; color: black; margin-top: 34px ;padding: 21px;border-radius: 21px;">--}}
{{--        <h1 class="mb-4">Add New Jersey</h1>--}}
{{--        <form>--}}
{{--            @csrf--}}

{{--            <div class="form-group">--}}
{{--                <label for="jersey_name">Jersey Name:</label>--}}
{{--                <input type="text" name="jersey_name" id="jersey_name" class="form-control" required>--}}
{{--            </div>--}}

{{--            <div class="form-group">--}}
{{--                <label for="jersey_image1">Jersey Image1:</label>--}}
{{--                <div class="custom-file">--}}
{{--                    <input type="file" name="jersey_image1" id="jersey_image" class="custom-file-input" required>--}}
{{--                    <label class="custom-file-label" for="jersey_image">Choose file</label>--}}
{{--                </div>--}}
{{--            </div>--}}
{{--            <div class="form-group">--}}
{{--                <label for="jersey_image2">Jersey Image2:</label>--}}
{{--                <div class="custom-file">--}}
{{--                    <input type="file" name="jersey_image2" id="jersey_image" class="custom-file-input" required>--}}
{{--                    <label class="custom-file-label" for="jersey_image">Choose file</label>--}}
{{--                </div>--}}
{{--            </div>--}}
{{--            <div class="form-group">--}}
{{--                <label for="jersey_image3">Jersey Image3:</label>--}}
{{--                <div class="custom-file">--}}
{{--                    <input type="file" name="jersey_image3" id="jersey_image" class="custom-file-input" required>--}}
{{--                    <label class="custom-file-label" for="jersey_image">Choose file</label>--}}
{{--                </div>--}}
{{--            </div>--}}

{{--            <div class="form-group">--}}
{{--                <label for="club_id">Club:</label>--}}
{{--                <select name="club_id" id="club_id" class="form-control" required>--}}
{{--                    @foreach ($clubs as $club)--}}
{{--                        <option value="{{ $club->id }}">{{ $club->name }}</option>--}}
{{--                    @endforeach--}}
{{--                </select>--}}
{{--            </div>--}}

{{--            <div class="form-group">--}}
{{--                <label for="brand_id">Brand:</label>--}}
{{--                <select name="brand_id" id="brand_id" class="form-control" required>--}}
{{--                    @foreach ($brands as $brand)--}}
{{--                        <option value="{{ $brand->id }}">{{ $brand->name }}</option>--}}
{{--                    @endforeach--}}
{{--                </select>--}}
{{--            </div>--}}

{{--            <div class="form-group">--}}
{{--                <label for="league_id">League:</label>--}}
{{--                <select name="league_id" id="league_id" class="form-control" required>--}}
{{--                    @foreach ($leagues as $league)--}}
{{--                        <option value="{{ $league->id }}">{{ $league->name }}</option>--}}
{{--                    @endforeach--}}
{{--                </select>--}}
{{--            </div>--}}

{{--            <div class="form-group">--}}
{{--                <label for="price">Price:</label>--}}
{{--                <div class="input-group">--}}
{{--                    <div class="input-group-prepend">--}}
{{--                        <span class="input-group-text">$</span>--}}
{{--                    </div>--}}
{{--                    <input type="number" step="0.01" name="price" id="price" class="form-control" required>--}}
{{--                </div>--}}
{{--            </div>--}}

{{--            <div class="form-group">--}}
{{--                <label for="quantity">Quantity:</label>--}}
{{--                <input type="text" name="quantity" id="quantity" class="form-control" required>--}}
{{--            </div>--}}
{{--            <br>--}}
{{--            <button type="submit" class="btn btn-primary">Create Jersey</button>--}}
{{--        </form>--}}
{{--    </div>--}}



    <form class="container form-container"  action="{{ route('jersey.store') }}" method="POST" enctype="multipart/form-data" id="form_container">
        @csrf
        <div class="title">
            <h1>Create New Item</h1>
        </div>
        <div class="form-group">
            <div class="upload">
{{--                <div class="img-container">--}}
{{--                    <i class="fa-solid fa-file-arrow-up"></i>--}}
{{--                    <p>Drag and Drop OR <span>Browse</span></p>--}}
{{--                </div>--}}
                <div class="img-container" id="imageBox">
                    <i class="fa-solid fa-file-arrow-up"></i>
                    <p>Drag and Drop OR <span>Browse</span></p>
                    <input
                        type="file"
                        id="fileInput"
                        accept="image/*"
                        multiple
                        style="display: none"

                    />
                </div>

                <div class="upload-desc">
                    <h5>File Types Supported:</h5>
                    <p>jpeg,gif,png or webp(max 2mb)</p>
                </div>
            </div>

            <div class="form">
                <div class="form-inputs">
                    <i class="fa-solid fa-t"></i>
                    <input type="text" placeholder="Add Jersey name" name="jersey_name" id="jersey_name" required/>
                </div>
                <div class="form-inputs">
                    <i class="fa-solid fa-puzzle-piece"></i>
                    <!-- <input type="text" placeholder="Choose The Club" /> -->
                    <select name="club_id" id="club_id"  >
{{--                        <option value="">Choose a Club</option>--}}
                       @foreach($clubs as $club)
                           <option value="{{$club->id}}" >{{ $club->name }}</option>
                       @endforeach
                    </select>
                </div>
                <div class="form-inputs">
                    <i class="fa-solid fa-baseball"></i>
                    <select name="league_id" id="league_id"  required>
{{--                        <option value="">Choose a League</option>--}}
                        @foreach ($leagues as $league)
                            <option value="{{ $league->id }}">{{ $league->name }}</option>
                        @endforeach
                    </select>
                </div>
                <div class="form-inputs">
                    <i class="fa-regular fa-copyright"></i>
                    <!-- <input type="text" placeholder="Choose The Brand" /> -->

                    <select name="brand_id" id="brand_id"  required>
{{--                        <option value="">Choose a Brand</option>--}}
                        @foreach ($brands as $brand)
                            <option value="{{ $brand->id }}">{{ $brand->name }}</option>
                        @endforeach
                    </select>
                </div>
            </div>
        </div>

        <div class="finance-grp">
            <div class="finance-inputs">
                <label for="price">$ Price :</label>
                <input type="text" id="price" name="price" />
            </div>

            <div class="finance-inputs">
                <label for="qunatity">Quantity</label>
                <input type="text" id="quantity-id" name="quantity" />
            </div>

            <div class="finance-inputs">
                <label for="sizes">Available Sizes :</label>
                <select name="sizes" id="sizes">
                    <option value="default" selected>Choose a Size</option>
                    <option value="S">Small</option>
                    <option value="M">Medium</option>
                    <option value="L">Large</option>
                    <option value="XL">Extra large</option>
                </select>
            </div>
        </div>

        <div class="btn-con">
            <button type="submit" class="submit-btn">Create Jersey</button>
        </div>
    </form>
<script src="{{ asset("js/upload.js") }}"></script>
@endsection
