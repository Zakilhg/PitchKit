
function confirmDelete(event) {
    event.preventDefault();
    Swal.fire({
        title: 'Do you want to Delete this item ?',
        showCancelButton: true,
        confirmButtonColor: 'red',
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        denyButtonAriaLabel: 'Cancel',
    }).then((result) => {
        if (result.isConfirmed) {
            event.target.parentElement.submit();
            Swal.fire('Deleted!', '', 'success');
        } else if (result.isDenied) {
            Swal.fire('Changes are not saved', '', 'info');
        }
    });
}
