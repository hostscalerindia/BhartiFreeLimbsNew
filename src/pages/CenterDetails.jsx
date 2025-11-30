import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useData } from "../context/DataContext";
import { get } from "../utils/api";

function CenterDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { centers, services, loading, errors } = useData();

  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const center = useMemo(() => {
    if (location.state?.center) return location.state.center;
    const centerIdNum = Number(id);
    return centers.find((c) => c.id === centerIdNum);
  }, [centers, id, location.state]);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setError(null);
    get(`/api/center-galleries?center_id=${id}`)
      .then((res) => {
        if (!isMounted) return;
        const rows = res.data || [];
        const list = rows.map((item) => ({
          id: item.id,
          title: item.title,
          url: `${
            import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"
          }/api/center-galleries/${item.id}/image`,
          created_at: item.created_at,
        }));
        setImages(list);
      })
      .catch((err) => {
        if (!isMounted) return;
        setError("Failed to load gallery images");
      })
      .finally(() => {
        if (!isMounted) return;
        setIsLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleBackToCenters = () => navigate(-1);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-section-second text-white py-5 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 mt-20 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-snug">
            {center?.name || "Center"}
          </h1>
          {center?.location && (
            <p className="text-xs sm:text-sm md:text-base mb-6 max-w-3xl mx-auto opacity-90 leading-relaxed">{center.location}</p>
          )}
        </div>
      </section>

      {/* Center Details Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <div className="mb-6">
            <button
              onClick={handleBackToCenters}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-full font-semibold transition-all duration-300 flex items-center justify-center w-fit mb-6"
            >
              <i className="fa fa-arrow-left mr-2"></i>
              Back to Centers
            </button>
          </div>
          {/* Content with Image Float */}
          <div className="overflow-hidden max-w-6xl mx-auto flex flex-col md:block">
            {/* Image Section - Floated Left */}
             <div className="w-full md:w-1/3 md:float-left md:mr-6 mb-6 md:mb-4 relative h-64 md:h-96 overflow-hidden rounded-2xl shadow-xl">
              {center?.image ? (
                <img
                  src={center.image}
                  alt={center.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                  }}
                />
              ) : null}
              <div
                className={`w-full h-full ${
                  center?.image ? "hidden" : "flex"
                } items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200`}
              >
                <i className="fa fa-hospital text-blue-600 text-6xl"></i>
              </div>
            </div>

            {/* Text Content - Flows around image */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              {center?.name}
            </h2>
              </h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                {center?.description || "No description available."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Images Grid */}
      <section className="py-12 bg-white">
        <div className="flex items-center justify-center mb-4">
          <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mr-3">
            <i className="fa fa-heart text-white text-sm"></i>
          </div>
          <span className="text-blue-600 text-sm md:text-base font-medium">
            Gallary
          </span>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
                <span className="text-gray-600">Loading images...</span>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-red-500 mb-2">
                <i className="fa fa-exclamation-triangle text-3xl"></i>
              </div>
              <p className="text-sm">{error}</p>
            </div>
          ) : images.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-neutral-500">
                <i className="fa fa-info-circle text-3xl mb-2"></i>
                <p>No images available for this center.</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {images.map((img, idx) => (
                <div
                  key={img.id}
                  className="rounded-xl overflow-hidden shadow border border-neutral-200"
                >
                  <img
                    src={img.url}
                    alt={img.title || `Image ${idx + 1}`}
                    className="w-full h-60 object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default CenterDetails;
