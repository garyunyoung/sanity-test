import { sanityClient } from "../sanity"

export default function Home({ properties }) {
  console.log(properties)
  return (
    <div>
      {properties && (
        <div>
          {properties.map((property, key) =>
            <div key={key}>
              <p>_____</p>
              <p>{property.title}</p>
              <p>{property.description}</p>
              <p>{property.pricePerNight}</p>
              <p>{property.propertyType}</p>
              <p>_____</p>
            </div>)}
        </div>
      )}
    </div>
  )
}


export const getServerSideProps = async () => {
  const query = '*[ _type == "property"]'
  const properties = await sanityClient.fetch(query)

  if (!properties.length) {
    return {
      props: {
        properties: []
      }
    }
  } else {
    return {
      props: {
        properties
      }
    }
  }
}
