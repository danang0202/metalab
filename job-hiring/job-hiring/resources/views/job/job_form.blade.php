@extends('layouts.user')

@section('container')
    <div class="container mx-5 mb-2">
        <form action="{{ route('job.save') }}" method="POST">
            @csrf
            <div class="mb-3">
                <label for="name" class="form-label">Nama Pekerjaan</label>
                <input type="text" class="form-control" id="name" name="name">
            </div>
            <div class="mb-3">
                <label for="description" class="form-label">Deskripsi</label>
                <textarea class="form-control" id="description" name="description"></textarea>
            </div>
            <div class="mb-3">
                <label for="whyJoin" class="form-label">Alasan Bergabung</label>
                <textarea class="form-control" id="whyJoin" name="whyJoin"></textarea>
            </div>
            <div class="mb-3">
                <label for="requirements" class="form-label">Persyaratan</label>
                <textarea class="form-control" id="requirements" name="requirements"></textarea>
            </div>
            <div class="mb-3">
                <label for="offer" class="form-label">Penawaran</label>
                <textarea class="form-control" id="offer" name="offer"></textarea>
            </div>
            <div class="mb-3">
                <label for="thumbnail" class="form-label">Thumbnail</label>
                <input type="text" class="form-control" id="thumbnail" name="thumbnail">
            </div>
            <div class="mb-3">
                <label for="kontrakStart" class="form-label">Tanggal Kontrak Dimulai</label>
                <input type="date" class="form-control" id="kontrakStart" name="kontrakStart">
            </div>
            <div class="mb-3">
                <label for="kontrakEnd" class="form-label">Tanggal Kontrak Berakhir</label>
                <input type="date" class="form-control" id="kontrakEnd" name="kontrakEnd">
            </div>
            <div class="mb-3">
                <label for="gajiLowe" class="form-label">Gaji Minimum</label>
                <input type="number" class="form-control" id="gajiLowe" name="gajiLowe">
            </div>
            <div class="mb-3">
                <label for="gajiUpper" class="form-label">Gaji Maksimum</label>
                <input type="number" class="form-control" id="gajiUpper" name="gajiUpper">
            </div>
            <div class="mb-3">
                <label for="client_id" class="form-label">Klien</label>
                <select class="form-select" id="client_id" name="client_id">
                    <option value="0" selected>Pilih Klien</option>
                    @foreach ($clients as $client)
                        <option value="{{ $client->id }}">{{ $client->name }}</option>
                    @endforeach
                </select>
            </div>
            
            <button type="submit" class="btn btn-primary">Simpan</button>
        </form>
    </div>
@endsection
