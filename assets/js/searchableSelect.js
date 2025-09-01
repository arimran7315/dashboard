$(document).ready(function() {
    // Initialize searchable select
    $('.select2-search').select2({
        placeholder: "Select a country",
        allowClear: true,
        width: '100%'
    });

    // Handle dark mode toggle for Select2
    const observer = new MutationObserver(() => {
        $('.select2-search').select2({
            dropdownParent: $('.select2-search').parent()
        });
    });

    observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class']
    });
});