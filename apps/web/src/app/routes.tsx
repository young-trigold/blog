import React, { Suspense } from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import LoadingPage from '../components/LodingIndicator';
import NotFoundPage from '../pages/404';
import HomePage from '../pages/home';

const NotePage = React.lazy(() => import('../pages/notes'));
const ContentPage = React.lazy(() => import('../pages/content'));
const ChapterListPage = React.lazy(() => import('../pages/chpaters'));
const UserPage = React.lazy(() => import('../pages/users'));
const CalculatorPage = React.lazy(() => import('../pages/utils/calculator'));

const RouterPart = () => {
  return (
    <Router>
      <Routes>
        <Route path="*" element={<NotFoundPage />} />
        <Route path="/" element={<Navigate to="/articles" />} />
        <Route path="/articles" element={<HomePage />} />
        <Route
          path="/notes"
          element={
            <Suspense fallback={<LoadingPage />}>
              <NotePage />
            </Suspense>
          }
        />
        <Route
          path="/utils/calculator"
          element={
            <Suspense fallback={<LoadingPage />}>
              <CalculatorPage />
            </Suspense>
          }
        />
        <Route
          path="/notes/:noteTitle"
          element={
            <Suspense fallback={<LoadingPage />}>
              <ChapterListPage />
            </Suspense>
          }
        />

        <Route
          path="/articles/:itemId"
          element={
            <Suspense fallback={<LoadingPage />}>
              <ContentPage isChapter={false} editable={false} />
            </Suspense>
          }
        />
        <Route
          path="/edit/articles/:itemId"
          element={
            <Suspense fallback={<LoadingPage />}>
              <ContentPage isChapter={false} editable />
            </Suspense>
          }
        />

        <Route
          path="/chapters/:itemId"
          element={
            <Suspense fallback={<LoadingPage />}>
              <ContentPage isChapter editable={false} />
            </Suspense>
          }
        />

        <Route
          path="/edit/chapters/:itemId"
          element={
            <Suspense fallback={<LoadingPage />}>
              <ContentPage isChapter editable />
            </Suspense>
          }
        />

        <Route
          path="/users/:userId"
          element={
            <Suspense fallback={<LoadingPage />}>
              <UserPage />
            </Suspense>
          }
        />
      </Routes>
    </Router>
  );
};

export default RouterPart;
