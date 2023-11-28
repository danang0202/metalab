$(document).ready(function () {
    $('#search-input').on('keyup', function () {
        let query = $(this).val();
        console.log(query);
        $.get('/search', { query: query }, function (data) {
            $('#search-results').html(data);
        });
    });
});

