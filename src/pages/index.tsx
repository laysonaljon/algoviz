const HomePage = () => {
  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Welcome to AlgoViz Dashboard!</h1>
      <p className="text-lg text-gray-700 dark:text-gray-300">
        Select an algorithm type from the sidebar to begin visualizing.
      </p>
      <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
        This is your main dashboard. Explore sorting and searching algorithms through the navigation.
      </p>
    </div>
  );
};

export default HomePage;