import { Menu } from '@prisma/client'
import { v4 as uuid } from 'uuid'
import { ResolverContext } from '../../typings'
import { AddMenuInput, AddMenuResponse } from '../resolvertypes'

export async function addMenu(
    _: any,
    args: AddMenuInput,
    ctx: ResolverContext,
): Promise<AddMenuResponse> {
    try {
        if (args.menu.length !== 28) {
            throw new Error('There should be exactly 7 x 4 = 28 entries')
        }

        const menuTable: Array<Menu> = []

        for (const [i, menuEntry] of args.menu.entries()) {
            const mealDate = new Date(menuEntry.mealDate)

            const menuDoc: Menu = {
                mealId: uuid(),
                createdAt: new Date(),
                mealDate,
                mealContent: menuEntry.mealContent,
                mealType: menuEntry.mealType,
            }

            menuTable.push(menuDoc)
        }

        await ctx.prisma.menu.createMany({ data: menuTable })

        return { success: true, error: null }
    } catch (e) {
        let errorMessage = e.message
        return { success: false, error: errorMessage }
    }
}
