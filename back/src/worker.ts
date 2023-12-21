import cron from 'node-cron';
import { QueueEvents } from 'bullmq';

import { logger } from '@utils/logger';
import {
  processAndPersistStationStatusesAsTasks,
  processAndPersistStationInfosAsTasks,
  runStationsWorker,
  STATIONS_STATIONS_QUEUE_NAME,
} from '@modules/stations';
import { getRedisClient } from './databases';

export const runWorker = () => {
  runStationsWorker();

  cron.schedule('*/2 * * * *', () => {
    processAndPersistStationStatusesAsTasks().subscribe({
      error: err => {
        logger.error(`error processing jobs ${err}`);
      },
      complete: () => {
        logger.info('Stations processing started at: ' + Date.now());
      },
    });

    processAndPersistStationInfosAsTasks().subscribe({
      error: err => {
        logger.error(`error processing jobs ${err}`);
      },
      complete: () => {
        logger.info('Stations processing started at: ' + Date.now());
      },
    });
  });

  const queueEvents = new QueueEvents(STATIONS_STATIONS_QUEUE_NAME, {
    connection: getRedisClient(),
  });

  queueEvents.on('completed', ({ jobId }) => {
    logger.info('done processing job: ' + jobId);
  });

  queueEvents.on('failed', ({ jobId, failedReason }) => {
    logger.error(`error processing job: ${jobId} - error ${failedReason}`);
  });
};
