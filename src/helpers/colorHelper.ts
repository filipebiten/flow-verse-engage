export function definePeriodBadgeColor(period: string) {
    switch(period){
        case 'diário':
            return 'bg-blue-500';
        case 'Diário':
            return 'bg-blue-500';
        case 'semanal':
            return 'bg-yellow-500';
        case 'Semanal':
            return 'bg-yellow-500';
        case 'mensal':
            return 'bg-red-500';
        case 'Mensal':
            return 'bg-red-500';
        case 'semestral':
            return 'bg-purple-500';
        case 'Semestral':
            return 'bg-purple-500';
        case 'anual' :
            return 'bg-cyan-500';
        case 'Anual':
            return 'bg-cyan-500';
        case 'especial':
            return 'bg-purple-500';
        case 'Especial':
            return 'bg-purple-500';
    }
}