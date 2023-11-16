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
                <th>Client</th>
                <th colspan="2" >Action</th>
            </thead>
            <tbody id="search-results">
                @foreach ($jobs as $job)
                    <tr>
                        <td>{{ $job->id }}</td>
                        <td>{{ $job->name }}</td>
                        <td>{{ $job->client->name }}</td>
                        <td><a href="/job-edit/{{ $job->id }}"><i class="fas fa-pen text-success"></i></a></td>
                        <td><a href="/job-delete/{{ $job->id }}"><i class="fas fa-trash text-danger"></i></a></td>
                    </tr>
                @endforeach
            </tbody>

        </table>
    </div>
@endsection

