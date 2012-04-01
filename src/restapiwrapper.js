//
// TODO:
//	- Generic extend/mixin object for basic jquery calls
//  - Function for handling a server error
//


var RestAPIWrapper = function( options )
{
	///<summary>
	///	Usually just need to pass in {url: 'http://some/api/path/'} as the options
	///</summary>
	
	this.properties = jQuery.extend( this.defaults, options );

}; RestAPIWrapper.prototype = {
	
	///<summary>
	///	Holds all the properties for this api access
	///</summary>
	defaults: {

		url: '' // Base URL for the API, ie: http://api.example.com/
		, endpoint : '' // Current endpoint, ie: 'contact'
		, controller : ''
		
		// these are the odata filters
		, odata_orderby : ''
		, odata_top : 20
		, odata_skip : 0
		, odata_filter : ''
	},

	//
	// Helpers
	//
	constructEndPoint: function( args ) {
		///<summary>
		///	Helper method for constructing the endpoint for an api call
		///</summary>
		var endpoint = this.properties.url;
		if( args.controller )
			this.properties.controller = args.controller;

		if( !this.properties.controller ) {
			alert('Formatting error: controller not set');
			return '';
		}
		
		endpoint += this.properties.controller + '/';

		if( args.id )
			endpoint += args.id;
		
		this.properties.endpoint = endpoint; // stash for later
		return endpoint
	},

	//
	// Paging 
	//

	constructPaging: function( endpoint, args ) {
		
		///<summary>
		///	constructs paging for this request
		///</summary>
		
		// paging -- TODO: url escape or something
		var paging = '';

		// store properties based on the passed in args
		if( args.orderby )
			this.properties.odata_orderby = args.orderby;
		if( args.filter )
			this.properties.odata_filter = args.filter;
		if( args.top )
			this.properties.odata_top = args.top;
		if( args.skip != null )
			this.properties.odata_skip = args.skip;
		
		// construct this request
		paging = ( this.properties.odata_orderby
					? '$orderby=' + this.properties.odata_orderby + '&'
					: '' )
				+ ( this.properties.odata_filter
					? '$filter=' + this.properties.odata_filter + '&'
					: '' )
				+ '$top=' + this.properties.odata_top 
				+ '&$skip=' + this.properties.odata_skip 
		;
		
		return endpoint + '?' + paging;
	},

	//
	// Basic methods
	//
	
	create : function (args) {
		
		///<summary>
		///	Performs a create request against this api args: controller, model, success, error
		///<param name="args" type="object">controller : eg 'contact' or 'address', model: the object to create, success: function to call on success, error: function to call on error </params>
		///</summary>
		var endpoint = this.constructEndPoint( args );
		if( !endpoint )
			return;

		$.ajax({ 
            url: endpoint
			, type: 'post'
			, data: args.model
			, cache: false
			, statusCode: { 
                201: /* created */ function(data) { 
                    if( args.success ) args.success(data);
                },
				500: /* error */ function(data) { 
                    alert('server error');
					if( args.error ) args.error(data);
                }
            } 
        }); 		
	},
	
	get : function (args) {
		///<summary>
		///Performs a get request. If an Id is passed then it will be a single item get, otherwise it'll get all items and page them
		///<param name="args" type="object">controller : eg 'contact' or 'address', id: (optional) id of the object to get, success: function to call on success, error: function to call on error </params>
		///</summary>
		var endpoint = this.constructEndPoint( args );
		if( !endpoint )
			return;

		if( !args.id || args.usePaging ) // means this is a list style lookup
			endpoint = this.constructPaging( endpoint, args );

		$.ajax({ 
            url: endpoint
			, type: 'get'
			, cache: false
			, statusCode: { 
                200: /* no content */ function(data) { 
					if( args.success ) args.success(data);
                },
				404: /* not found */ function(data) { 
                    if( args.error ) args.error(data);
                },
				500: /* server error */ function(data) { 
                    alert('server error');
					//if( args.error ) args.error(data);
                }
            } 
        }); 	
	},
	

	next:  function( args ) {
		///<summary>
		/// Gets the next page of data from a get request
		/// <param name="args" type="object">id: (required) id of the object to delete, model: json object to pass to this update endpoint, success: function to call on success, error: function to call on error </params>
		///</summary>
		
		this.properties.odata_skip += this.properties.odata_top;		
		args.controller = this.properties.controller;
		
		this.get( args );
	},

	update : function (args) {
		///<summary>
		///	Performs an update request; args: controller, id, success, error
		/// <param name="args" type="object">controller : eg 'contact' or 'address', id: (required) id of the object to update, model: json object to pass to this update endpoint, success: function to call on success, error: function to call on error </params>
		///</summary>
		var endpoint = this.constructEndPoint( args );
		if( !endpoint )
			return;

		if( !args.model ) {
			alert('Formatting error: model not set');
			return '';
		}
		
		$.ajax({ 
            url: endpoint
			, type: 'put'
			, data: args.model
			, cache: false
			, statusCode: { 
                204: /* no content */ function(data) { 
                    if( args.success ) args.success(data);
                },
				404: /* not found */ function(data) { 
                    if( args.error ) args.error(data);
                },
				500: /* server error */ function(data) { 
                    alert('server error');
					//if( args.error ) args.error(data);
                }
            } 
        }); 		
	},

	delete : function (args) {
		///<summary>
		/// Performs a delete request; args: controller, id, success, error
		/// <param name="args" type="object">controller : eg 'contact' or 'address', id: (required) id of the object to delete, model: json object to pass to this update endpoint, success: function to call on success, error: function to call on error </params>
		///</summary>
		var endpoint = this.constructEndPoint( args );
		if( !endpoint )
			return;

		$.ajax({ 
            url: endpoint
			, type: 'delete'
			, cache: false
			, statusCode: { 
                204: /* No content */ function(data) { 
                    if( args.success ) args.success(data);
                },
				404: /* Not found */ function(data) { 
                    if( args.error ) args.error(data);
                },
				500: /* server error */ function(data) { 
                    //alert('server error');
					if( args.error ) args.error(data);
                }
            } 
        });
	}
};

