import './style.scss';
import Renderer from './core/Renderer';
import BoxPage from './pages/box/BoxPage';
import PointsPage from './pages/points/PointsPage';
import FieldPage from './pages/field/FieldPage';
import ParticlesPage from './pages/particles/ParticlesPage';
import {Page} from './core/Page';
import ChaosPage from './pages/chaos/ChaosPage';
import RingsPage from './pages/rings/RingsPage';
import RaymarchingPage from "./pages/raymarching/RaymarchingPage";

type PageConstructor = {
    new(...params: any): Page
};

interface RoutesDictionary {
    [key: string]: PageConstructor;
}

const routes: RoutesDictionary = {
    box: BoxPage,
    points: PointsPage,
    field: FieldPage,
    el: ParticlesPage,
    thomas: ChaosPage,
    rings: RingsPage,
    raymarching: RaymarchingPage,
}

const renderer = new Renderer();
let page: Page;
const setPageByUrl = async () => {
    if (page) {
        page.requiresDestroy() && page.onDestroy();
        page.scene.clear();
    }
    renderer.camera.position.set(0, 0, 1000);

    const segments = new URL(window.location.href).hash.split('/');
    const pageName = segments.shift().substring(1);
    const pageClass = routes[pageName];
    if (!pageClass) {
        window.location.href = '#box';
    }
    page = new pageClass(renderer, segments);
    renderer.scene = page.scene;
}

document.body.addEventListener('click', (e: MouseEvent) => {
    const isDataLinkClicked = (e.target instanceof HTMLAnchorElement) && e.target.matches('[data-link]');
    if (!isDataLinkClicked) {
        return;
    }
    e.preventDefault();
    history.pushState(null, null, (e.target as HTMLAnchorElement).href);
    setPageByUrl();
});
document.addEventListener('DOMContentLoaded', setPageByUrl);
window.addEventListener('popstate', setPageByUrl);

document.body.appendChild(renderer.domElement);
