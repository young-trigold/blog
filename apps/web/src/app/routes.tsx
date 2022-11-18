import React, { Suspense } from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';

import LoadingPage from '../components/LodingIndicator';
import NotFoundPage from '../pages/404';
import HomePage from '../pages/home';

const NotePage = React.lazy(() => import('../pages/notes'));
const ContentPage = React.lazy(() => import('../pages/content'));
const ChapterListPage = React.lazy(() => import('../pages/chpaters'));
const ProtectPage = React.lazy(() => import('../pages/admin'));
const UserPage = React.lazy(() => import('../pages/users'));

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
					path="/notes/:noteTitle"
					element={
						<Suspense fallback={<LoadingPage />}>
							<ChapterListPage />
						</Suspense>
					}
				/>

				<Route
					path="/articles/:itemID"
					element={
						<Suspense fallback={<LoadingPage />}>
							<ContentPage isChapter={false} editable={false} />
						</Suspense>
					}
				/>
				<Route
					path="/edit/articles/:itemID"
					element={
						<Suspense fallback={<LoadingPage />}>
							<ContentPage isChapter={false} editable />
						</Suspense>
					}
				/>

				<Route
					path="/chapters/:itemID"
					element={
						<Suspense fallback={<LoadingPage />}>
							<ContentPage isChapter editable={false} />
						</Suspense>
					}
				/>

				<Route
					path="/edit/chapters/:itemID"
					element={
						<Suspense fallback={<LoadingPage />}>
							<ContentPage isChapter editable />
						</Suspense>
					}
				/>

				<Route
					path="/admin"
					element={
						<Suspense fallback={<LoadingPage />}>
							<ProtectPage />
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
