import { LandingHow } from './LandingHow';
import { LandingModules } from './LandingModules';
import { LandingRoadmap } from './LandingRoadmap';
import { TaxiDemos } from '@/features/showcase/taxi-demos/TaxiDemos';

/* =========================================================================
   LandingBody, aiTAXI. The one landing whose middle is not the template's.

   The six agency landings sell a service and their body is Showcase (the product demonstrated)
   then Work (how the engagement runs). aiTAXI sells operating software to a taxi company that
   does not have robotaxis yet, so its body answers three different questions:

     LandingHow      how a fleet adopts the platform, in three steps
     LandingModules  the five operational jobs a driverless fleet creates, which the platform covers
     LandingRoadmap  where this actually is, which is pre-launch, said plainly

   The roadmap is the most honest thing on the page and it is the reason a fleet operator would
   trust the rest of it. Replacing it with a template section would have been a downgrade dressed
   up as consistency.
   ========================================================================= */

export function LandingBody() {
  return (
    <>
      <LandingHow />
      <LandingModules />
      <TaxiDemos />
      <LandingRoadmap />
    </>
  );
}
