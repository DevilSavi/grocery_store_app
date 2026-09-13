var urlParams = new URLSearchParams(window.location.search);
var order_id = urlParams.get("order_id");
var productModal = $('#unitModal');

$(function () {
  $.get(orderDetailsListApiUrl + "?order_id=" + order_id, 
        function(response) {
    if(response) {
      var table = '';
      $.each(response, function(index, order) {
        table += ` 
          <tr
            data-order-id="${order.order_id}"
            data-product-id="${order.product_id}"
            data-product-name="${order.name}"
            data-quantity="${order.quantity}"
            data-total-price="${order.total_price}"
            data-discount="${order.discount}">

            <td>${order.order_id}</td>
            <td>${order.name}</td>
            <td>${order.quantity}</td>
            <td>${order.total_price.toFixed(2)}</td>
            <td>${order.discount.toFixed(2)}</td>

            <td>
              <span class="btn btn-xs btn-primary edit-order">
                Edit
              </span>
              <span class="btn btn-xs btn-danger delete-order">
                Delete
              </span>
            </td>
          </tr>
        `;

      });
      $("table").find("tbody").html(table);
    }
  })
})


$("#saveItem").on("click", function() {
  var data = $("#unitForm").serializeArray();

  var requestPayload = {
    order_id: order_id,
    product_id: null,
    old_product_id: null,
    quantity: null,
    total_price: null,
    discount: null
  };

  // Get the original product ID when editing
  var oldProductId = $('#unitModal').data('old-product-id');

  for (var i = 0; i < data.length; ++i) {
      var element = data[i];

      switch(element.name) {
        case 'product':
          requestPayload.product_id = element.value;
          break;
        case 'qty':
          requestPayload.quantity = element.value;
          break;
        case 'item_total':
          requestPayload.total_price = element.value;
          break;
        case 'item_discount':
          requestPayload.discount = element.value;
          break;
      }
  }

  // Check if adding a new item
  if ($('#id').val() == 0) {
    callApi(
      "POST",
      orderDetailsSaveApiUrl,
      {
        'data': JSON.stringify(requestPayload)
      }
    );

  } else {
    requestPayload.old_product_id = oldProductId;
    callApi(
      "POST",
      orderDetailsUpdateApiUrl,
      {
        'data': JSON.stringify(requestPayload)
      }
    );
  }
});


$(document).on("click", ".delete-order", function () {
  var tr = $(this).closest('tr');

  var data = {
    order_id: tr.data('order-id'),
    product_id: tr.data('product-id')
  };

  var isDelete = confirm(
    "Are you sure you want to delete " +
    tr.data('product-name') +
    "?"
  );
  if (isDelete) {
    callApi(
      "POST",
      orderDetailsDeleteApiUrl,
      data
    );
  }
});


$(document).on("click", ".edit-order", function () {
  var tr = $(this).closest('tr');
  var productId = tr.data('product-id');
  var quantity = tr.data('quantity');
  var totalPrice = tr.data('total-price');
  var discount = tr.data('discount');

  $('#id').val('1');
  $('#name').val(productId);
  $('#qty').val(quantity);
  $('#item_total').val(totalPrice);
  $('#item_discount').val(discount);

  // Store the ORIGINAL product ID
  $('#unitModal').data(
    'old-product-id',
    productId
  );
  $('#unitModal .modal-title').text(
    'Edit Order Item'
  );
  $('#unitModal').modal('show');
});


productModal.on('hidden.bs.modal', function(){
    $('#id').val('0');
    $('#name').val('');
    $('#qty').val('');
    $('#item_total').val('');
    $('#item_discount').val('');

    productModal.removeData('selectedUnit');
    productModal.find('.model-title')
        .text('Add New Order');
});

productModal.on('show.bs.modal', function(){
    //JSON data by API call
    $.get(productListApiUrl, function (response) {
        if(response) {
            var options = '<option value="">--Select--</option>';
            $.each(response, function(index, product) {
              options += '<option value="' +
                product.product_id +
                '">' +
                product.name +
                '</option>';
            });
            $("#name").empty().html(options);

            // check if editing
            var selectedUnit = productModal.data('selectedUnit');
            if (selectedUnit) {
                $("#name").val(selectedProduct);
            }
        }
    });
});