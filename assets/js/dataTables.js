$(document).ready(function () {
    // Initialize DataTable with editing capabilities
    var table = $('#DatatableEditable').DataTable({
        "paging": true,
        "searching": true,
        "ordering": true,
        "info": true,
        "lengthMenu": [5, 10, 25, 50],
        "pageLength": 5,
        "columnDefs": [
            {
                "targets": [2], // Status column
                "render": function(data, type, row) {
                    if (type === 'display') {
                        let statusClass = '';
                        
                        if (data === 'Completed') {
                            statusClass = 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
                        } else if (data === 'Pending') {
                            statusClass = 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
                        } else if (data === 'Cancelled') {
                            statusClass = 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
                        } else if (data === 'Shipped') {
                            statusClass = 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
                        }
                        
                        return `<span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClass}">${data}</span>`;
                    }
                    return data;
                }
            }
        ]
    });

    // Make cells editable on click
    $('#DatatableEditable tbody').on('click', 'td:not(:last-child)', function() {
        var cell = table.cell(this);
        var currentData = cell.data();
        var columnIndex = cell.index().column;
        var rowIndex = cell.index().row;
        var column = table.column(columnIndex);
        var columnType = column.header().getAttribute('data-type') || 'text';

        // Skip editing if it's the status column (we'll handle it separately)
        if (columnIndex === 2) return;

        var inputType = columnType === 'date' ? 'date' : 'text';
        
        // Create input element
        var input = document.createElement('input');
        input.type = inputType;
        input.value = currentData;
        input.className = 'w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-800 dark:text-white';

        // Handle input completion
        function completeEdit() {
            var newValue = input.value;
            if (newValue !== currentData) {
                cell.data(newValue).draw();
                
                // Show success toast
                showToast('success', `Updated order #${rowIndex + 1}`);
                
                // Here you would typically send an AJAX request to update the server
                console.log(`Updated row ${rowIndex}, column ${columnIndex} to: ${newValue}`);
            }
            $(this).off('blur keyup');
        }

        // Replace cell content with input
        cell.data('');
        $(this).html(input);
        input.focus();

        // Handle completion events
        $(input).on('blur', completeEdit);
        $(input).on('keyup', function(e) {
            if (e.key === 'Enter') {
                completeEdit.call(this);
            } else if (e.key === 'Escape') {
                cell.data(currentData).draw();
                $(this).off('blur keyup');
            }
        });
    });

    // Status column dropdown editor
    $('#DatatableEditable tbody').on('click', 'td:nth-child(3)', function() {
        var cell = table.cell(this);
        var currentData = cell.data();
        
        // Create dropdown
        var dropdown = document.createElement('select');
        dropdown.className = 'w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-800 dark:text-white';
        
        // Status options
        var options = ['Completed', 'Pending', 'Cancelled', 'Shipped'];
        options.forEach(function(option) {
            var opt = document.createElement('option');
            opt.value = opt.textContent = option;
            if (option === currentData) opt.selected = true;
            dropdown.appendChild(opt);
        });

        // Handle completion
        function completeStatusEdit() {
            var newValue = dropdown.value;
            if (newValue !== currentData) {
                cell.data(newValue).draw();
                
                // Show success toast
                showToast('success', `Status updated to: ${newValue}`);
                
                // Here you would typically send an AJAX request to update the server
                console.log(`Updated status to: ${newValue}`);
            }
            $(this).off('blur change');
        }

        // Replace cell content with dropdown
        cell.data('');
        $(this).html(dropdown);
        dropdown.focus();

        // Handle completion events
        $(dropdown).on('blur', completeStatusEdit);
        $(dropdown).on('change', completeStatusEdit);
        $(dropdown).on('keyup', function(e) {
            if (e.key === 'Escape') {
                cell.data(currentData).draw();
                $(this).off('blur change keyup');
            }
        });
    });

    // Add row functionality
    $('#add-row-btn').on('click', function() {
        var newRow = table.row.add([
            '#' + Math.floor(Math.random() * 10000),
            'New Customer',
            'Pending',
            new Date().toISOString().split('T')[0],
            '$0.00'
        ]).draw().node();
        
        $(newRow).addClass('highlight-new-row');
        setTimeout(() => {
            $(newRow).removeClass('highlight-new-row');
        }, 2000);
        
        // Show success toast
        showToast('success', 'New order added successfully');
    });

    // Existing DataTables initialization
    $('#Datatable').DataTable({
        "paging": true,
        "searching": true,
        "ordering": true,
        "info": true,
        "lengthMenu": [5, 10, 25, 50],
        "pageLength": 5
    });
});