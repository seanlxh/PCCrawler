var Datatable = function() {

    var tableOptions; // main options
    var dataTable; // datatable object
    var table; // actual table jquery object
    var tableContainer; // actual table container object
    var tableWrapper; // actual table wrapper jquery object
    var tableInitialized = false;
    var ajaxParams = {}; // set filter mode
    var the;

    var countSelectedRecords = function() {
        //var selected = $('tbody > tr > td:nth-child(1) input[type="checkbox"]:checked', table).size();
        //var text = tableOptions.dataTable.language.metronicGroupActions;
        //if (selected > 0) {
        //    $('.table-group-actions > span', tableWrapper).text(text.replace("_TOTAL_", selected));
        //} else {
        //    $('.table-group-actions > span', tableWrapper).text("");
        //}
    };

    return {

        //main function to initiate the module
        init: function(options) {

            if (!$().dataTable) {
                return;
            }

            the = this;

            // default settings
            options = $.extend(true, {
                src: "", // actual table  
                filterApplyAction: "filter",
                filterCancelAction: "filter_cancel",
                resetGroupActionInputOnSuccess: true,
                loadingMessage: '载入中...',
                dataTable: {
                    "dom": "<'table-scrollable't><'m-table-bottom table-info'<'m-table-length'l><'m-table-info'i><'m-table-page'p>>",
                    "lengthMenu":  [10, 15, 50, 100, 150],
                    "pageLength": 10, // default records per page
                    "language": { // language settings
                        // data tables spesific
                        "lengthMenu": "每页显示 _MENU_ 条记录",
                        "info": "当前显示 _START_ 到 _END_ 条，共 _TOTAL_ 条记录",
                        "infoEmpty": "暂无数据",
                        "emptyTable": "表中无数据存在",
                        "zeroRecords": "暂无数据",
                        "loadingRecords": "载入中...",
                        "processing":     "处理中...",
                        "paginate": {
                            "previous": "上一页",
                            "next": "下一页",
                            "last": "尾页",
                            "first": "首页",
                            "page": "第",
                            "pageOf": "页  共"
                        }
                    },
                    "searching": true,
                    "ordering": true,
                    "paginationType": "bootstrap",
                    "orderCellsTop": true,
                    "columnDefs": [{ // define columns sorting options(by default all columns are sortable extept the first checkbox column)
                        'orderable': false,
                        'targets': [0]
                    }],

                    //pagingType: 'full_numbers',
                    "paginationType": 'full_numbers',	
                    //"pagingType": "bootstrap_extended", // pagination type(bootstrap, bootstrap_full_number or bootstrap_extended)
                    "autoWidth": false, // disable fixed width and enable fluid table
                    "processing": true, // enable/disable display message box on record load
                    "serverSide": true, // enable/disable server side ajax loading

                    "ajax": { // define ajax settings
                        "url": "", // ajax URL
                        "type": "POST", // request type
                        "timeout": 20000,
                        "data": function(data) { // add request parameters before submit
                            $.each(ajaxParams, function(key, value) {
                                data[key] = value;
                            });
                        },
                        "dataSrc": function(res) { // Manipulate the data returned from the server
                        	if(res.data != null){
                        		return res.data;
                        	}else{
                        		return res;
                        	}
                        },
                        "error": function() { // handle general connection errors
                            if (tableOptions.onError) {
                                tableOptions.onError.call(undefined, the);
                            }
                        }
                    },

                    "drawCallback": function(oSettings) { // run some code on table redraw
                        if (tableInitialized === false) { // check if table has been initialized
                            tableInitialized = true; // set table initialized
                            table.show(); // display table
                        }
                        countSelectedRecords(); // reset selected records indicator
                        //$("input[type=checkbox]").uniform();
                    }
                }
            }, options);

            tableOptions = options;

            // create table's jquery object
            table = $(options.src);
            tableContainer = table.parents(".table-container");

            // initialize a datatable
            dataTable = table.DataTable(options.dataTable);

            // get table wrapper
            tableWrapper = table.parents('.dataTables_wrapper');

            // build table group actions panel
            if ($('.table-actions-wrapper', tableContainer).size() === 1) {
                $('.table-group-actions', tableWrapper).html($('.table-actions-wrapper', tableContainer).html()); // place the panel inside the wrapper
                $('.table-actions-wrapper', tableContainer).remove(); // remove the template container
            }
            // handle group checkboxes check/uncheck
            $('.group-checkable', table).change(function() {
                var set = $('tbody > tr > td:nth-child(1) input[type="checkbox"]', table);
                var checked = $(this).is(":checked");
                $(set).each(function() {
                    $(this).attr("checked", checked);
                });
                //$.uniform.update(set);
                countSelectedRecords();
            });

            // handle row's checkbox click
            table.on('change', 'tbody > tr > td:nth-child(1) input[type="checkbox"]', function() {
                countSelectedRecords();
            });

            // handle filter submit button click
            table.on('click', '.filter-submit', function(e) {
                e.preventDefault();
                the.submitFilter();
            });

            // handle filter cancel button click
            table.on('click', '.filter-cancel', function(e) {
                e.preventDefault();
                the.resetFilter();
            });
        },

        submitFilter: function() {
            dataTable.ajax.reload();
        },

        resetFilter: function() {
            the.clearAjaxParams();
            dataTable.ajax.reload();
        },
		
		/**
		 * 复选框选中个数
		 */
        getSelectedRowsCount: function() {
            return $('tbody > tr > td:nth-child(1) input[type="checkbox"]:checked', table).size();
        },
		/**
		 * 复选框选中行
		 */
        getSelectedRows: function() {
            var rows = [];
            $('tbody > tr > td:nth-child(1) input[type="checkbox"]:checked', table).each(function() {
                rows.push($(this).val());
            });

            return rows;
        },
		/**
		 * 清空复选框
		 */
		clearCheckbox: function(){
			$('input[type="checkbox"]', table).prop('checked',false).parent().removeClass('checked');
		},
		/**
		 * 单选框选中行
		 */
        getSelectedRow: function() {
            var r=$('tbody > tr > td:nth-child(1) input[type="radio"]:checked', table);
			if(r.length==0){
				return null;
			}else{
				return $(r).val();
			}
        },
		/**
		 * 清空单选框
		 */
		clearRadio: function(){
			$('input[type="radio"]', table).prop('checked',false);
		},

        setAjaxParam: function(name, value) {
            ajaxParams[name] = value;
        },

        addAjaxParam: function(name, value) {
        	ajaxParams[name] = value;
        },

        clearAjaxParams: function(name, value) {
            ajaxParams = {};
        },

        getDataTable: function() {
            return dataTable;
        },

        getTableWrapper: function() {
            return tableWrapper;
        },

        gettableContainer: function() {
            return tableContainer;
        },

        getTable: function() {
            return table;
        }

    };

};