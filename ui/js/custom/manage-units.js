var unitModal = $("#unitModal");
    $(function () {

        //JSON data by API call
        $.get(uomListApiUrl, function (response) {
            if(response) {
                var table = '';
                $.each(response, function(index, uom) {
                    table += '<tr data-id="'+ uom.uom_id +'" data-name="'+ uom.uom_name +'">' +
                        '<td>'+ uom.uom_name +'</td>'+
                        '<td>'+
                            '<span class="btn btn-xs btn-danger delete-unit">Delete</span>'+
                            ' <span class="btn btn-xs btn-danger edit-unit">Edit</span>'+
                        '</td></tr>';
                });
                $("table").find('tbody').empty().html(table);
            }
        });
    });

    $("#saveUnit").on("click", function () {
        // If we found id value in form then update unit detail
        var data = $("#unitForm").serializeArray();
        var requestPayload = {
            uom_id: $('#id').val(),
            uom_name: null
        };
        for (var i=0;i<data.length;++i) {
            var element = data[i];
            switch(element.name) {
                case 'name':
                    requestPayload.uom_name = element.value;
                    break;
            }
        }
        // check if add or update
        if (requestPayload.uom_id == 0) {
            callApi("POST", uomSaveApiUrl, {
                'data': JSON.stringify(requestPayload)
            });
        } else {
            // update uom
            callApi("POST", uomUpdateApiUrl, {
                'data': JSON.stringify(requestPayload)
            });
        }

    });

    $(document).on("click", ".delete-unit", function (){
        var tr = $(this).closest('tr');
        var data = {
            uom_id : tr.data('id')
        };
        var isDelete = confirm("Are you sure to delete "+ tr.data('name') +" item?");
        if (isDelete) {
            callApi("POST", uomDeleteApiUrl, data);
        }
    });

    $(document).on("click", ".edit-unit", function (){
        var tr = $(this).closest('tr');
        
        var uomId = tr.data('id');
        var uomName = tr.data('name');

        $('#id').val(uomId);
        $('#name').val(uomName);

        unitModal.find('.modal-title').text('Edit Unit');
        unitModal.modal('show');
        unitModal.data('selectedUnit', uomId);
    });

    unitModal.on('hidden.bs.modal', function(){
        $("#id").val('0');
        $("#name").val('');
        $("#uom").val('');
        $("#price").val('');

        unitModal.removeData('selectedUnit');
        productModal.find('.model-title')
            .text('Add New Product');
    });

    // productModal.on('show.bs.modal', function(){
    //     //JSON data by API call
    //     $.get(uomListApiUrl, function (response) {
    //         if(response) {
    //             var options = '<option value="">--Select--</option>';
    //             $.each(response, function(index, uom) {
    //                 options += '<option value="'+ uom.uom_id +'">'+ uom.uom_name +'</option>';
    //             });
    //             $("#uoms").empty().html(options);

    //             // check if editing
    //             var selectedUnit = productModal.data('selectedUnit');
    //             if (selectedUnit) {
    //                 $("uoms").val(selectedUnit);
    //             }
    //         }
    //     });
    // });