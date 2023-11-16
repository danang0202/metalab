@extends('layouts.user')

@section('container')
    <form action="{{ route('edit.action') }}" method="POST">
        @csrf
        <input type="hidden" name="id" value="{{ $client->id }}">
        <div class="mb-3">
            <label for="exampleInputEmail1" class="form-label">Nama</label>
            <input type="text" class="form-control" id="" aria-describedby="emailHelp"  name="name" value="{{ $client->name }}">
            {{-- <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div> --}}
        </div>
        <div class="mb-3">
            <label for="exampleInputPassword1" class="form-label">Email</label>
            <input type="email" class="form-control" id="" name="email" value="{{ $client->email }}">
        </div>
        <div class="mb-3">
            <label for="exampleInputEmail1" class="form-label">Address</label>
            <input type="text" class="form-control"  aria-describedby="emailHelp"  name="address" value="{{ $client->address }}">
            {{-- <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div> --}}
        </div>
        <div class="mb-3">
            <label for="exampleInputEmail1" class="form-label">Nomor Telepon</label>
            <input type="text" class="form-control"  aria-describedby="emailHelp" name="noTelp" value="{{ $client->noTelp }}">
            {{-- <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div> --}}
        </div>
        <button type="submit" class="btn btn-primary">Submit</button>
    </form>
@endsection
