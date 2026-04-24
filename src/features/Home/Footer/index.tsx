import { FiBriefcase, FiMail, FiPhone, FiMapPin } from 'react-icons/fi'
import Typography from '@/components/Typographie'
import { useIntl } from 'react-intl'
import Link from 'next/link'
import { LOGO_ICON } from '@/assets/images'

export function Footer() {
    const intl = useIntl()

    const candidateLinks = [
        { href: '/offers',             labelId: 'footer.searchJob' },
        { href: '/login',              labelId: 'footer.createAccount' },
        { href: '/conseils-carriere',  labelId: 'footer.careerAdvice' },
        { href: '/contact',            labelId: 'footer.contactTitle' },
    ]

    const employerLinks = [
        { href: '/contact',     labelId: 'footer.postOffer' },
        { href: '/contact',     labelId: 'footer.ourSolutions' },
        { href: '/contact',     labelId: 'footer.salesContact' },
    ]

    const legalLinks = [
        { href: '/mentions-legales', labelId: 'footer.legal' },
        { href: '/confidentialite',  labelId: 'footer.privacy' },
        { href: '/cgu',              labelId: 'footer.terms' },
    ]

    return (
        <footer className="bg-gray-900 text-gray-400 py-16 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <div>
                        <Link href="/" className="flex items-center space-x-2 mb-4">
                            <img src={LOGO_ICON} alt="Logo" height="18" width="60" />
                        </Link>
                        <Typography variant="p" className="text-gray-400 leading-relaxed text-sm">
                            {intl.formatMessage({ id: 'footer.tagline' })}
                        </Typography>
                    </div>

                    {/* Candidates */}
                    <div>
                        <Typography variant="h6" weight="semibold" className="text-white mb-5">
                            {intl.formatMessage({ id: 'footer.candidates' })}
                        </Typography>
                        <ul className="space-y-3 text-sm">
                            {candidateLinks.map((item) => (
                                <li key={item.labelId}>
                                    <Link href={item.href} className="hover:text-yellow-500 transition-colors">
                                        {intl.formatMessage({ id: item.labelId })}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Employers */}
                    <div>
                        <Typography variant="h6" weight="semibold" className="text-white mb-5">
                            {intl.formatMessage({ id: 'footer.employers' })}
                        </Typography>
                        <ul className="space-y-3 text-sm">
                            {employerLinks.map((item) => (
                                <li key={item.labelId}>
                                    <Link href={item.href} className="hover:text-yellow-500 transition-colors">
                                        {intl.formatMessage({ id: item.labelId })}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <Typography variant="h6" weight="semibold" className="text-white mb-5">
                            {intl.formatMessage({ id: 'footer.contactTitle' })}
                        </Typography>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-center gap-2">
                                <FiMail size={14} className="text-yellow-500 shrink-0" />
                                <a href="mailto:contact@rhmanagment.fr" className="hover:text-yellow-500 transition-colors">
                                    contact@rhmanagment.fr
                                </a>
                            </li>
                            <li className="flex items-center gap-2">
                                <FiPhone size={14} className="text-yellow-500 shrink-0" />
                                <a href="tel:+33123456789" className="hover:text-yellow-500 transition-colors">
                                    +33 1 23 45 67 89
                                </a>
                            </li>
                            <li className="flex items-start gap-2">
                                <FiMapPin size={14} className="text-yellow-500 shrink-0 mt-1" />
                                <span>
                                    123 Avenue des Champs-Elysees<br />
                                    75008 Paris, France
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <Typography variant="p" className="text-gray-500 text-sm">
                        {intl.formatMessage({ id: 'footer.copyright' })}
                    </Typography>
                    <div className="flex gap-6 text-sm">
                        {legalLinks.map((item) => (
                            <Link key={item.labelId} href={item.href} className="hover:text-yellow-500 transition-colors">
                                {intl.formatMessage({ id: item.labelId })}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    )
}