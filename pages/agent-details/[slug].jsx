import React from 'react';
import axios from "axios";
import { GET_SEO_SETTINGS } from "@/utils/api";
import Meta from "@/Components/Seo/Meta";
import dynamic from 'next/dynamic';

const AgentDetails = dynamic(
  () => import('@/Components/Agents/AgentDetails'),
  {
    ssr: false,
    loading: () => <p>Loading agent details...</p>
  }
);

// Fetch SEO data from API
const fetchDataFromSeo = async (slug) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_END_POINT}${GET_SEO_SETTINGS}?page=agent-details`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching SEO data:", error);
    return null;
  }
};

// Component
const AgentDetailsPage = ({ seoData, currentURL }) => {
  const seo = seoData?.data?.[0] || {};

  return (
    <>
      <Meta
        title={seo.meta_title || "Agent Details | eBroker"}
        description={seo.meta_description || "Explore details of the best agents"}
        keywords={seo.meta_keywords || ""}
        ogImage={seo.meta_image || ""}
        pathName={currentURL}
      />
      <AgentDetails />
    </>
  );
};

// Server-side rendering (conditional)
let serverSidePropsFunction = null;

if (process.env.NEXT_PUBLIC_SEO === "true") {
  serverSidePropsFunction = async (context) => {
    const { slug } = context.params;

    const currentURL = `${process.env.NEXT_PUBLIC_WEB_URL}/properties-details/${slug}/`;
    const seoData = await fetchDataFromSeo(slug);

    return {
      props: {
        seoData,
        currentURL,
      },
    };
  };
}

export const getServerSideProps = serverSidePropsFunction;
export default AgentDetailsPage;
