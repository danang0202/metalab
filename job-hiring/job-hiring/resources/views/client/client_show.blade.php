@extends('layouts.user')

@section('container')
    <div class="container mx-5 mb-2">
        <form class="d-flex" role="search" id="search-box">
            <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search" id="search-input">
            <button class="btn btn-outline-success" type="submit">Search</button>
        </form>
    </div>
    <div class="container">

        <table class="table table-striped table-hover">
            <thead>
                <th>#</th>
                <th>Nama</th>
                <th>Email</th>
                <th>Alamat</th>
                <th>No Telepon</th>
                <th colspan="2" >Action</th>
            </thead>
            <tbody id="search-results">
                @foreach ($clients as $client)
                    <tr>
                        <td>{{ $client->id }}</td>
                        <td>{{ $client->name }}</td>
                        <td>{{ $client->email }}</td>
                        <td>{{ $client->noTelp }}</td>
                        <td>{{ $client->address }}</td>
                        <td><a href="/client-edit/{{ $client->id }}"><i class="fas fa-pen text-success"></i></a></td>
                        <td><a href="/client-delete/{{ $client->id }}"><i class="fas fa-trash text-danger"></i></a></td>
                    </tr>
                @endforeach
            </tbody>

        </table>
    </div>
@endsection

