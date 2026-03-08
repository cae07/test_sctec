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
router.get('/', EmpreendimentoController.getAll);

/**
 * GET /api/empreendimentos/:id
 * Obter um empreendimento por ID
 */
router.get('/:id', EmpreendimentoController.getById);

/**
 * PUT /api/empreendimentos/:id
 * Atualizar um empreendimento
 */
router.put('/:id', EmpreendimentoController.update);

export default router;
