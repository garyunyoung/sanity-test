import { sanityClient, urlFor } from "../../sanity"


const Property = ({
  title,
  location,
  propertyType,
  mainImage,
  images,
  pricePerNight,
  beds,
  bedrooms,
  description,
  host,
  reviews,
}) => {

  const { alt, lat, lng } = location
  const reviewAmount = reviews.length

  return (
    <div>
      <h1>Tite: {title}</h1>
      <h1>Location: {alt} {lat} {lng}</h1>
      <h1>Property Type: {propertyType}</h1>
      <h1>Hosted by: {host?.name}</h1>
      <h1>Price Per Night: {pricePerNight}</h1>
      <h1>Beds: {beds}</h1>
      <h1>Bedrooms: {bedrooms}</h1>
      <h1>Description{description}</h1>
      <h1>Reviews: {reviewAmount}</h1>
      <div>
        <Image image={mainImage} />
        <div>
          {images.map((_key, image) => <Image key={_key} image={image} />)}
        </div>
      </div>
      {reviews.map((review, key) => <Review key={key} review={review} />)}
    </div>
  )
}

export const getServerSideProps = async (pageContext) => {
  const pageSlug = pageContext.query.slug
  const query = `*[ _type == "property" && slug.current == $pageSlug][0]{
    title, 
    location, 
    propertyType,
    mainImage, 
    images, 
    pricePerNight, 
    beds, 
    bedrooms, 
    description, 
    host->{
      _id, 
      name,
      slug,
      image, 
    }, 
    reviews[]{
      ...,
      traveller=>{
        _id, 
        name, 
        slug, 
        image
      }
    }
  }`

  const property = await sanityClient.fetch(query, { pageSlug })

  if (!property) {
    return {
      props: null,
      notFound: true
    }
  } else {
    return {
      props: {
        title: property.title,
        location: property.location,
        propertyType: property.propertyType,
        mainImage: property.mainImage,
        images: property.images,
        pricePerNight: property.pricePerNight,
        beds: property.beds,
        bedrooms: property.bedrooms,
        description: property.description,
        host: property.host,
        reviews: property.reviews
      }
    }
  }
}



const Image = ({ image }) => {
  return (
    <div>
      <img src={urlFor(image).auto('format')} />
    </div>
  )
}

const Review = ({ review }) => {
  const { rating, reviewDescription, traveller } = review

  console.log(traveller.name)
  return (
    <div>
      <p>Rating: {rating}</p>
      <p>Review Description: {reviewDescription}</p>

    </div>
  )
}

export default Property