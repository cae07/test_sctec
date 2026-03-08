import { Router } from 'express';
import { EmpreendimentoController } from '../controllers/EmpreendimentoController';

const router = Router();

/**
 * POST /api/empreendimentos
 * Criar um novo empreendimento
 */
router.post('/', EmpreendimentoController.createNew);

/**
 * GET /api/empreendimentos
 * Obter todos os empreendimentos
 */

export default router;
