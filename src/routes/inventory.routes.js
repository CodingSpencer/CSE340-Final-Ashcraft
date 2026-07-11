import { Router } from 'express';
import { showInventory, showVehicleDetail } from '../controllers/inventory.controller.js';

const router = Router();

router.get('/', showInventory);
router.get('/:id', showVehicleDetail);

export default router;