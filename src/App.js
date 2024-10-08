import { useEffect, useState, createContext, useContext } from "react";
import { faker } from "@faker-js/faker";

function createRandomPost() {
  return {
    title: `${faker.hacker.adjective()} ${faker.hacker.noun()}`,
    body: faker.hacker.phrase(),
  };
}
// Context API
// 1) Create the Provider
const PostContext = createContext();


function App() {
  const [posts, setPosts] = useState(() =>
    Array.from({ length: 30 }, () => createRandomPost())
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [isFakeDark, setIsFakeDark] = useState(false);

  const searchedPosts =
    searchQuery.length > 0
      ? posts.filter((post) =>
          `${post.title} ${post.body}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        )
      : posts;

  function handleAddPost(post) {
    setPosts((posts) => [post, ...posts]);
  }

  function handleClearPosts() {
    setPosts([]);
  }

  useEffect(
    function () {
      document.documentElement.classList.toggle("fake-dark-mode");
    },
    [isFakeDark]
  );

  return (
    // 2) Provide value to the child components
    <PostContext.Provider value={{
      posts: searchedPosts, 
      onAddPost: handleAddPost, 
      onClearPosts: handleClearPosts,
      searchQuery: searchQuery,
      setSearchQuery: setSearchQuery
      }}>
      <section>
        <button
          onClick={() => setIsFakeDark((isFakeDark) => !isFakeDark)}
          className="btn-fake-dark-mode"
        >
          {isFakeDark ? "☀️" : "🌙"}
        </button>

        <Header/>
        <Main/>
        <Archive/>
        <Footer />
      </section>
    </PostContext.Provider>
  );
}

function Header() {
  // 3) Consuming the context value
  const { onClearPosts } = useContext(PostContext);

  return (
    <header>
      <h1>
        <span>⚛️</span>The Atomic Blog
      </h1>
      <div>
        <Results/>
        <SearchPosts />
        <button onClick={onClearPosts}>Clear posts</button>
      </div>
    </header>
  );
}

function SearchPosts() {
  // 3) Consuming the context value
  const {searchQuery, setSearchQuery} = useContext(PostContext);

  return (
    <input
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      placeholder="Search posts..."
    />
  );
}

function Results() {
  // 3) Consuming the context value
  const {posts} = useContext(PostContext);

  return <p>🚀 {posts.length} atomic posts found</p>;
}

function Main() { 
  return (
    <main>
      <FormAddPost/>
      <Posts/>
    </main>
  );
}

function Posts() {
  return (
    <section>
      <List/>
    </section>
  );
}

function FormAddPost() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  // 3) Consuming the context value
  const {onAddPost} = useContext(PostContext);

  const handleSubmit = function (e) {
    e.preventDefault();

    if (!body || !title) return;

    onAddPost({ title, body });
    setTitle("");
    setBody("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Post title"
      />
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Post body"
      />
      <button>Add post</button>
    </form>
  );
}

function List() {
  // 3) Consuming the context value
  const {posts} = useContext(PostContext);

  return (
    <ul>
      {posts.map((post, i) => (
        <li key={i}>
          <h3>{post.title}</h3>
          <p>{post.body}</p>
        </li>
      ))}
    </ul>
  );
}

function Archive() {
  const [posts] = useState(() => Array.from({ length: 5000 }, () => createRandomPost()));
  const [showArchive, setShowArchive] = useState(false);
  // 3) Consuming the context value
  const {onAddPost} = useContext(PostContext);
  
  return (
    <aside>
      <h2>Post archive</h2>
      <button onClick={() => setShowArchive((s) => !s)}>
        {showArchive ? "Hide archive posts" : "Show archive posts"}
      </button>

      {showArchive && (
        <ul>
          {posts.map((post, i) => (
            <li key={i}>
              <p>
                <strong>{post.title}:</strong> {post.body}
              </p>
              <button onClick={() => onAddPost(post)}>Add as new post</button>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}

function Footer() {
  return <footer>&copy; by The Atomic Blog ✌️</footer>;
}

export default App;