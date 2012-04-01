using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Net;
using System.Net.Http;
using System.Web.Http.SelfHost;
using System.Web.Http;

namespace TestApiServer
{
	#region Models

	/// <summary>
	/// Basic person class used for testing
	/// </summary>
	public class Person
	{
		public int Id { get; set; }
		public string FirstName { get; set; }
		public string LastName { get; set; }
		public string Email { get; set; }
	}

	#endregion

	#region Controllers

	public class PersonController : ApiController
	{
		protected List<Person> people;

		#region Constructor
		public PersonController( )
		{
			people = new List<Person>( );

			for (var i = 0; i < 20; i++)
			{
				people.Add( new Person( )
				{
					Id = i,
					FirstName = "First" + i.ToString( ),
					LastName = "Last" + i.ToString( ),
					Email = string.Concat( "email", i.ToString( ), "@domain.com" )
				} );
			}
		}
		#endregion

		// GET /api/person
		public IQueryable<Person> Get( )
		{
			return people.AsQueryable( );
		}

		// GET /api/person/5
		public Person Get( int id )
		{
			return people
					.Where( p => p.Id == id )
					.FirstOrDefault( );
		}

		// POST /api/person/{}
		public HttpResponseMessage<Person> Post( Person model )
		{
			model.Id = people.Last( ).Id + 1; // fake an auto-increment
			
			var response = new HttpResponseMessage<Person>( model, HttpStatusCode.Created );
			if (Request != null)
			{
				response.Headers.Location = new Uri( Request.RequestUri,
					Url.Route( "Details", new { id = model.Id } )
				);
			}
			return response;
		}

		// PUT /api/person/{}
		public HttpResponseMessage Put( Person model )
		{
			return new HttpResponseMessage( HttpStatusCode.NoContent );
		}

		// DELETE /api/person/5
		public HttpResponseMessage Delete( int id )
		{
			return new HttpResponseMessage( HttpStatusCode.NoContent );
		}
	}

	#endregion

	#region Server

	class Program
	{
		static void Main( string[] args )
		{
			// Setup server configuration 
			var baseAddress = "http://localhost/jsRestApiWrapper/api/csharp/";
			var config = new HttpSelfHostConfiguration( baseAddress );

			config.Routes.MapHttpRoute(
			   name: "DefaultApi",
			   routeTemplate: "{controller}/{id}",
			   defaults: new { id = RouteParameter.Optional }
		   );

			// Create and open the server 
			var server = new HttpSelfHostServer( config );
			server.OpenAsync( ).Wait( );
			Console.WriteLine( "The server is running on: {0} (press any key to exit)", baseAddress );
			Console.ReadLine( );
		}
	}

	#endregion
}
