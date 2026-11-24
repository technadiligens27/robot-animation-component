import "./Loading.css"

const Loading = () => {
  return (
    <div className="portfolio-loader-container">
      <div
        className="portfolio-loader"
        role="status"
        aria-label="Loading"
      >
        <svg
          viewBox="22 22 44 44"
          className="portfolio-loader-svg"
        >
          <circle
            cx="44"
            cy="44"
            r="20.2"
            fill="none"
            strokeWidth="3.6"
            className="portfolio-loader-circle"
          />
        </svg>
      </div>
    </div>
  )
}

export default Loading