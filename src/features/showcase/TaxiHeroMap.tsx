'use client';

import { useTranslations } from 'next-intl';
import { useCallback, useLayoutEffect, useRef } from 'react';

import { Ico } from '@/components/common/Ico';

import { useTaxiDemoTimeline } from './taxi-demos/useTaxiDemoTimeline';
import './taxi-hero-map.css';

const UPPER_ROAD_PATH = 'M-20 68 C130 40 162 110 290 92 S470 30 630 62';
const LOWER_ROAD_PATH = 'M-20 248 C108 216 212 270 330 230 S500 188 630 214';
const LEFT_ROAD_PATH = 'M92 -20 C112 86 88 190 132 360';
const AI_ROUTE_START = 0.18;
const AI_ROUTE_END = 0.82;
const PICKUP_PROGRESS = 0.12;
const DESTINATION_PROGRESS = 0.9;
const AI_ROUTE_DURATION = 6500;
const AI_ROUTE_SAMPLES = 72;

type RenderedPathPoint = {
  x: number;
  y: number;
  angle: number;
};

function readRenderedPathPoint(
  path: SVGPathElement,
  canvas: HTMLDivElement,
  progress: number,
): RenderedPathPoint | null {
  const matrix = path.getScreenCTM();
  const svg = path.ownerSVGElement;
  if (!matrix || !svg) return null;

  const totalLength = path.getTotalLength();
  const clampedProgress = Math.min(1, Math.max(0, progress));
  const position = totalLength * clampedProgress;
  const tangentOffset = Math.max(1.5, totalLength * 0.004);

  const project = (length: number): DOMPoint => {
    const pathPoint = path.getPointAtLength(Math.min(totalLength, Math.max(0, length)));
    const svgPoint = svg.createSVGPoint();
    svgPoint.x = pathPoint.x;
    svgPoint.y = pathPoint.y;
    return svgPoint.matrixTransform(matrix);
  };

  const current = project(position);
  const before = project(position - tangentOffset);
  const after = project(position + tangentOffset);
  const canvasBounds = canvas.getBoundingClientRect();

  return {
    x: current.x - canvasBounds.left,
    y: current.y - canvasBounds.top,
    angle: Math.atan2(after.y - before.y, after.x - before.x) * (180 / Math.PI),
  };
}

function vehicleTransform(point: RenderedPathPoint): string {
  return `translate3d(${point.x.toFixed(3)}px, ${point.y.toFixed(3)}px, 0) rotate(${point.angle.toFixed(2)}deg)`;
}

function markerTransform(point: RenderedPathPoint): string {
  return `translate3d(${point.x.toFixed(3)}px, ${point.y.toFixed(3)}px, 0) translate(-50%, -50%)`;
}

function TaxiVehicleGlyph({ taxi = false }: { taxi?: boolean }): React.ReactElement {
  return (
    <svg
      className="taxi-hero-map__car-glyph"
      viewBox="0 0 88 40"
      aria-hidden="true"
      focusable="false"
    >
      <rect className="taxi-hero-map__car-wheel" x="13" y="0" width="14" height="5.5" rx="2.3" />
      <rect className="taxi-hero-map__car-wheel" x="13" y="34.5" width="14" height="5.5" rx="2.3" />
      <rect className="taxi-hero-map__car-wheel" x="59" y="0" width="14" height="5.5" rx="2.3" />
      <rect className="taxi-hero-map__car-wheel" x="59" y="34.5" width="14" height="5.5" rx="2.3" />

      <path
        className="taxi-hero-map__car-body"
        d="M11 3.8h45.5c8.2 0 14.3 2.7 20 8.1l7.1 5.8c1.7 1.3 1.7 3.3 0 4.6l-7.1 5.8c-5.7 5.4-11.8 8.1-20 8.1H11c-5.8 0-9-3.7-9-9.2V13c0-5.5 3.2-9.2 9-9.2Z"
      />
      <path
        className="taxi-hero-map__car-bonnet"
        d="M64 7.3c4.2 1.2 7.6 3.3 11.1 6.5l6.4 5.2c.8.7.8 1.3 0 2l-6.4 5.2c-3.5 3.2-6.9 5.3-11.1 6.5l3.2-8.5v-8.4L64 7.3Z"
      />
      <path
        className="taxi-hero-map__car-window taxi-hero-map__car-window--rear"
        d="M14.2 10h10.3v20H14.2l-5.4-6.8v-6.4L14.2 10Z"
      />
      <rect className="taxi-hero-map__car-roof" x="27.2" y="8.6" width="25.5" height="22.8" rx="5.2" />
      <path
        className="taxi-hero-map__car-window taxi-hero-map__car-window--front"
        d="M55.5 9.3h3.2c4.2 0 7.7 1.9 11 5.2l4.5 4.1c.9.8.9 2 0 2.8l-4.5 4.1c-3.3 3.3-6.8 5.2-11 5.2h-3.2V9.3Z"
      />
      <path className="taxi-hero-map__car-mirror" d="M57.5 2.2h7.2c1.2 0 2 .8 2 2v1.5h-9.2V2.2Z" />
      <path className="taxi-hero-map__car-mirror" d="M57.5 37.8h7.2c1.2 0 2-.8 2-2v-1.5h-9.2v3.5Z" />
      <path
        className="taxi-hero-map__car-detail"
        d="M25 10v20M54 9.4v21.2M68 14.2 65.2 20l2.8 5.8M6.8 14v12M76.2 13.6v12.8"
      />

      <rect className="taxi-hero-map__car-light taxi-hero-map__car-light--rear" x="4.2" y="8" width="3" height="5.4" rx="1.3" />
      <rect className="taxi-hero-map__car-light taxi-hero-map__car-light--rear" x="4.2" y="26.6" width="3" height="5.4" rx="1.3" />
      <rect className="taxi-hero-map__car-light taxi-hero-map__car-light--front" x="79.3" y="9" width="3" height="5.4" rx="1.3" />
      <rect className="taxi-hero-map__car-light taxi-hero-map__car-light--front" x="79.3" y="25.6" width="3" height="5.4" rx="1.3" />

      {taxi ? (
        <g className="taxi-hero-map__taxi-checker">
          <rect x="34.2" y="14.2" width="11.6" height="11.6" rx="3" />
          <rect x="36.7" y="16.7" width="2.2" height="2.2" />
          <rect x="41.1" y="16.7" width="2.2" height="2.2" />
          <rect x="38.9" y="18.9" width="2.2" height="2.2" />
          <rect x="36.7" y="21.1" width="2.2" height="2.2" />
          <rect x="41.1" y="21.1" width="2.2" height="2.2" />
        </g>
      ) : null}
    </svg>
  );
}

function FleetCandidate({
  id,
  status,
  reason,
  selected = false,
}: {
  id: string;
  status: string;
  reason: string;
  selected?: boolean;
}): React.ReactElement {
  return (
    <article
      className={`taxi-hero-map__candidate${selected ? ' taxi-hero-map__candidate--selected' : ''}`}
    >
      <span className="taxi-hero-map__candidate-icon" aria-hidden="true">
        <Ico
          name={selected ? 'solar:check-circle-bold-duotone' : 'solar:close-circle-bold-duotone'}
          className="size-5"
        />
      </span>
      <div>
        <span className="taxi-hero-map__candidate-id">{id}</span>
        <strong>{status}</strong>
        <p>{reason}</p>
      </div>
    </article>
  );
}

export function TaxiHeroMap(): React.ReactElement {
  const t = useTranslations('product.heroStory');
  const { containerRef, frame, replay } = useTaxiDemoTimeline('dispatch');
  const phase = frame.phase;
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const upperRoadRef = useRef<SVGPathElement | null>(null);
  const lowerRoadRef = useRef<SVGPathElement | null>(null);
  const b07CarRef = useRef<HTMLSpanElement | null>(null);
  const c21CarRef = useRef<HTMLSpanElement | null>(null);
  const aiCarRef = useRef<HTMLSpanElement | null>(null);
  const pickupRef = useRef<HTMLSpanElement | null>(null);
  const destinationRef = useRef<HTMLSpanElement | null>(null);
  const aiAnimationRef = useRef<Animation | null>(null);
  const setContainerRef = useCallback(
    (node: HTMLDivElement | null): void => {
      containerRef.current = node;
    },
    [containerRef],
  );

  const progressLabel =
    phase === 'problem'
      ? t('finding')
      : phase === 'ai-action'
        ? t('routing')
        : t('arrived');
  const flowStage = phase === 'result' ? 3 : phase === 'ai-action' ? 2 : 1;

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    const upperRoad = upperRoadRef.current;
    const lowerRoad = lowerRoadRef.current;
    const b07Car = b07CarRef.current;
    const c21Car = c21CarRef.current;
    const aiCar = aiCarRef.current;
    const pickup = pickupRef.current;
    const destination = destinationRef.current;

    if (
      !canvas ||
      !upperRoad ||
      !lowerRoad ||
      !b07Car ||
      !c21Car ||
      !aiCar ||
      !pickup ||
      !destination
    ) {
      return;
    }

    const placeVehicles = (): void => {
      aiAnimationRef.current?.cancel();
      aiAnimationRef.current = null;

      const b07Point = readRenderedPathPoint(upperRoad, canvas, 0.24);
      const c21Point = readRenderedPathPoint(upperRoad, canvas, 0.76);
      const pickupPoint = readRenderedPathPoint(lowerRoad, canvas, PICKUP_PROGRESS);
      const destinationPoint = readRenderedPathPoint(lowerRoad, canvas, DESTINATION_PROGRESS);

      if (b07Point) b07Car.style.transform = vehicleTransform(b07Point);
      if (c21Point) c21Car.style.transform = vehicleTransform(c21Point);
      if (pickupPoint) pickup.style.transform = markerTransform(pickupPoint);
      if (destinationPoint) destination.style.transform = markerTransform(destinationPoint);

      if (phase === 'ai-action') {
        const keyframes: Keyframe[] = [];

        for (let index = 0; index < AI_ROUTE_SAMPLES; index += 1) {
          const offset = index / (AI_ROUTE_SAMPLES - 1);
          const routeProgress = AI_ROUTE_START + (AI_ROUTE_END - AI_ROUTE_START) * offset;
          const point = readRenderedPathPoint(lowerRoad, canvas, routeProgress);
          if (!point) continue;
          keyframes.push({
            offset,
            transform: vehicleTransform(point),
          });
        }

        if (keyframes.length > 1) {
          aiCar.style.transform = String(keyframes[0]?.transform ?? '');
          aiAnimationRef.current = aiCar.animate(keyframes, {
            duration: AI_ROUTE_DURATION,
            easing: 'cubic-bezier(0.37, 0, 0.63, 1)',
            fill: 'forwards',
          });
        }
        return;
      }

      const aiPoint = readRenderedPathPoint(
        lowerRoad,
        canvas,
        phase === 'result' ? AI_ROUTE_END : AI_ROUTE_START,
      );
      if (aiPoint) aiCar.style.transform = vehicleTransform(aiPoint);
    };

    placeVehicles();

    if (typeof ResizeObserver === 'undefined') {
      return () => {
        aiAnimationRef.current?.cancel();
        aiAnimationRef.current = null;
      };
    }

    const resizeObserver = new ResizeObserver(placeVehicles);
    resizeObserver.observe(canvas);

    return () => {
      resizeObserver.disconnect();
      aiAnimationRef.current?.cancel();
      aiAnimationRef.current = null;
    };
  }, [phase]);

  return (
    <div
      ref={setContainerRef}
      className={`taxi-hero-map taxi-hero-map--${phase}`}
      data-hero-demo="true"
      data-landing-demo="true"
      data-demo-id="taxi-hero-proof"
      data-demo-detail={phase}
      aria-label={t('mapLabel')}
      aria-live="off"
    >
      <header className="taxi-hero-map__header">
        <span className="taxi-hero-map__badge">
          <span aria-hidden="true" />
          {t('badge')}
        </span>
        <span className="taxi-hero-map__brand">
          <span>ai</span>TAXI
        </span>
      </header>

      <div className="taxi-hero-map__flow" role="list" aria-label={t('flowLabel')}>
        <span
          className={`taxi-hero-map__flow-step is-reached${flowStage === 1 ? ' is-current' : ''}`}
          role="listitem"
          aria-current={flowStage === 1 ? 'step' : undefined}
        >
          <span className="taxi-hero-map__flow-number" aria-hidden="true">1</span>
          <strong>{t('flowRequest')}</strong>
        </span>
        <Ico name="solar:arrow-right-bold-duotone" className="taxi-hero-map__flow-arrow" />
        <span
          className={`taxi-hero-map__flow-step${flowStage >= 2 ? ' is-reached' : ''}${flowStage === 2 ? ' is-current' : ''}`}
          role="listitem"
          aria-current={flowStage === 2 ? 'step' : undefined}
        >
          <span className="taxi-hero-map__flow-number" aria-hidden="true">2</span>
          <strong>{t('flowSelected')}</strong>
        </span>
        <Ico name="solar:arrow-right-bold-duotone" className="taxi-hero-map__flow-arrow" />
        <span
          className={`taxi-hero-map__flow-step${flowStage >= 3 ? ' is-reached' : ''}${flowStage === 3 ? ' is-current' : ''}`}
          role="listitem"
          aria-current={flowStage === 3 ? 'step' : undefined}
        >
          <span className="taxi-hero-map__flow-number" aria-hidden="true">3</span>
          <strong>{t('flowConfirmed')}</strong>
        </span>
      </div>

      <section className="taxi-hero-map__request">
        <span className="taxi-hero-map__request-icon" aria-hidden="true">
          <Ico name="solar:map-point-bold-duotone" className="size-5" />
        </span>
        <div className="taxi-hero-map__request-copy">
          <span>{t('stageOneTitle')}</span>
          <strong>{t('stageOneRoute')}</strong>
          <p>
            <Ico name="solar:accessibility-bold-duotone" className="size-4" />
            {t('stageOneRequirement')}
          </p>
        </div>
        <span className="taxi-hero-map__step" aria-hidden="true">01</span>
      </section>

      <div ref={canvasRef} className="taxi-hero-map__canvas">
        <div className="taxi-hero-map__map-summary">
          <Ico name="solar:radar-2-bold-duotone" className="size-4" />
          <span>{t('mapSummary')}</span>
        </div>
        <div className="taxi-hero-map__map-label">
          <span>{t('mapLabel')}</span>
        </div>

        <svg
          className="taxi-hero-map__roads"
          viewBox="0 0 600 330"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path ref={upperRoadRef} className="taxi-hero-map__road" d={UPPER_ROAD_PATH} />
          <path ref={lowerRoadRef} className="taxi-hero-map__road" d={LOWER_ROAD_PATH} />
          <path className="taxi-hero-map__road" d={LEFT_ROAD_PATH} />
          <path className="taxi-hero-map__road" d="M380 -20 C350 92 412 178 382 360" />
          <path
            className="taxi-hero-map__route taxi-hero-map__route--ai"
            d={LOWER_ROAD_PATH}
            pathLength="1"
          />
        </svg>

        <span className="taxi-hero-map__block taxi-hero-map__block--one" aria-hidden="true" />
        <span className="taxi-hero-map__block taxi-hero-map__block--two" aria-hidden="true" />
        <span className="taxi-hero-map__block taxi-hero-map__block--three" aria-hidden="true" />
        <span className="taxi-hero-map__block taxi-hero-map__block--four" aria-hidden="true" />

        <span
          ref={b07CarRef}
          className="taxi-hero-map__road-car taxi-hero-map__road-car--ordinary"
          aria-hidden="true"
        >
          <span className="taxi-hero-map__car taxi-hero-map__car--ordinary">
            <TaxiVehicleGlyph />
            <span className="taxi-hero-map__car-code">B07</span>
          </span>
        </span>

        <span
          ref={c21CarRef}
          className="taxi-hero-map__road-car taxi-hero-map__road-car--ordinary"
          aria-hidden="true"
        >
          <span className="taxi-hero-map__car taxi-hero-map__car--ordinary">
            <TaxiVehicleGlyph />
            <span className="taxi-hero-map__car-code">C21</span>
          </span>
        </span>

        <span
          ref={aiCarRef}
          className="taxi-hero-map__road-car taxi-hero-map__road-car--ai"
          aria-hidden="true"
        >
          <span className="taxi-hero-map__car taxi-hero-map__car--ai">
            <TaxiVehicleGlyph taxi />
            <span className="taxi-hero-map__car-code">A12</span>
          </span>
        </span>

        <div className="taxi-hero-map__vehicle taxi-hero-map__vehicle--ai">
          <span className="taxi-hero-map__ai-label">
            <span>A12 · aiTAXI</span>
            <strong>{progressLabel}</strong>
          </span>
        </div>

        <div className="taxi-hero-map__operator-status">
          <Ico
            name={
              phase === 'result'
                ? 'solar:check-circle-bold-duotone'
                : 'solar:shield-check-bold-duotone'
            }
            className="size-4"
          />
          <span>{phase === 'result' ? t('stageThreeAction') : t('operatorControl')}</span>
        </div>

        <span
          ref={pickupRef}
          className="taxi-hero-map__route-point taxi-hero-map__route-point--pickup"
          aria-hidden="true"
        >
          1
        </span>
        <span
          ref={destinationRef}
          className="taxi-hero-map__destination taxi-hero-map__route-point"
          aria-hidden="true"
        >
          2
        </span>
      </div>

      <section className="taxi-hero-map__decision">
        <div className="taxi-hero-map__decision-head">
          <span className="taxi-hero-map__decision-icon" aria-hidden="true">
            <Ico name="solar:routing-2-bold-duotone" className="size-5" />
          </span>
          <strong>{t('stageTwoTitle')}</strong>
          <span className="taxi-hero-map__step" aria-hidden="true">02</span>
        </div>

        <div className="taxi-hero-map__candidates">
          <FleetCandidate
            id="A12"
            status={t('vehicleA12Status')}
            reason={t('vehicleA12Reason')}
            selected
          />
          <FleetCandidate
            id="B07"
            status={t('vehicleB07Status')}
            reason={t('vehicleB07Reason')}
          />
          <FleetCandidate
            id="C21"
            status={t('vehicleC21Status')}
            reason={t('vehicleC21Reason')}
          />
        </div>

        <div className="taxi-hero-map__result">
          <span className="taxi-hero-map__result-icon" aria-hidden="true">
            <Ico
              name={
                phase === 'result'
                  ? 'solar:check-circle-bold-duotone'
                  : 'solar:battery-charge-bold-duotone'
              }
              className="size-5"
            />
          </span>
          <div>
            <strong>{t('stageThreeTitle')}</strong>
            <p>{t('stageThreeDetail')}</p>
          </div>
          <span className="taxi-hero-map__result-status">{t('stageThreeAction')}</span>
          <span className="taxi-hero-map__step" aria-hidden="true">03</span>
        </div>
      </section>

      <p className="taxi-hero-map__summary">
        <Ico name="solar:shield-check-bold-duotone" className="size-5" />
        <span>{t('summary')}</span>
      </p>

      <footer className="taxi-hero-map__footer">
        <p>{t('simulationNote')}</p>
        <button type="button" onClick={replay} data-demo-replay="true" aria-label={t('replay')}>
          <Ico name="solar:refresh-bold-duotone" className="size-4" />
          <span>{t('replay')}</span>
        </button>
      </footer>
    </div>
  );
}
