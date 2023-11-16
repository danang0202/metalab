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
